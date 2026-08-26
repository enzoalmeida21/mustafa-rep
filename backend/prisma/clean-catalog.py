#!/usr/bin/env python3
"""Limpa os nomes de produto extraidos dos catalogos em PDF.

A extracao original colou no campo `name` conteudo que pertence a outras
colunas da planilha (embalagem, codigo interno, EAN, data de vigencia) e, na
Crivialli e na H2O, guardou apenas a variante do produto ("Lavanda",
"Eucalipto") sem a familia a que ela pertence.

Cada fonte e confiavel para uma parte:
  - `catalog-data.json` acertou a variante por SKU;
  - o titulo da secao no PDF tem a familia, recuperada por
    `tools/recover-names.py` para `tools/pdf-titles.json`.

Este script junta as duas, normaliza a caixa e nao altera `slug`, `sku`,
`ean`, `price` nem `packLabel`.

Uso:
    python3 clean-catalog.py --report      # so imprime o antes/depois
    python3 clean-catalog.py --write       # grava catalog-data.json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "catalog-data.json"
TITLES = HERE / "tools" / "pdf-titles.json"

# Marcas com grafia propria que nao devem passar pelo Title Case.
BRAND_OVERRIDES = {
    "H2O": "H2O",
    "OLIVEIRA": "Oliveira",
    "CASAFORT": "Casafort",
    "CRIVIALLI": "Crivialli",
    "PINHEIRENSE": "Pinheirense",
    "WYDA": "Wyda",
    "ALKLIN": "Alklin",
    "DOCTOR ANIMAL": "Doctor Animal",
    "FREE WAY": "Free Way",
}

MINOR_WORDS = {
    "a", "as", "ao", "aos", "com", "da", "das", "de", "do", "dos", "e", "em",
    "no", "nos", "na", "nas", "o", "os", "para", "por", "sem",
}

UNITS = {
    "CM": "cm", "G": "g", "KG": "kg", "L": "L", "M": "m", "MG": "mg",
    "MM": "mm", "ML": "ml", "PC": "pc", "PCS": "pcs", "UN": "un",
    "UNID": "unid",
}

# Palavras que sao unidade solta no fim do nome ("... 30CM UN").
BARE_UNITS = {"UN", "UND", "UNID", "PC", "PCS", "KG", "ML", "CX"}

# Siglas que perdem o sentido em Title Case.
ACRONYMS = {"WC", "PVC", "PET", "TNT", "UV", "LED", "H2O", "INPM"}

# O pdfplumber quebra as ligaduras "ti"/"fi" em duas palavras.
LIGATURES = {
    "Aromati zante": "Aromatizante",
    "Automoti vo": "Automotivo",
    "Gati lho": "Gatilho",
    "Inseti cida": "Inseticida",
    "Peti sco": "Petisco",
    "Preti nho": "Pretinho",
    "Refi l": "Refil",
    "higienizador": "Higienizador",
}

# Erros de grafia e acentos perdidos na fonte.
TYPOS = {
    "Desinfatante": "Desinfetante",
    "Moca": "Moça",
    "Xupao": "Xupão",
    "Sache": "Sachê",
    "Dobravel": "Dobrável",
    "Aco": "Aço",
    "Liquido": "Líquido",
}

# Linhas que a extracao criou a partir de um nome quebrado em duas: nao tem
# SKU, EAN nem preco e duplicam um produto que ja existe no catalogo.
GHOST_SLUGS = {"oliveira-beijo-de-moc"}

# Tipos de produto que devem abrir o nome quando a familia e uma "Linha X".
LINE_TYPES = (
    "shampoo", "condicionador", "creme", "mascara", "máscara", "gel",
    "sabonete", "kit",
)

MONTHS = (
    "JANEIRO|FEVEREIRO|MAR[ÇC]O|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO"
    "|OUTUBRO|NOVEMBRO|DEZEMBRO"
)

# Embalagem: separador opcional + Cx/Caixa/Fardo + numeros e unidade.
PACK = r"""\b(?:C\.?[xX]\.?|CAIXA|FARDO|FD\.?|DISPLAY[S]?|Pct\.?)\b
           [\s.:]* (?:C/\s*)? [\dxX×\s.,/]*
           (?:un|unid|und|ml|mL|ML|l|L|g|G|kg|KG|mg|cm|mm|m|pc|pcs)?[\s.]*"""
PACK_TAIL = re.compile(rf"[\s|/,;-]*{PACK}$", re.VERBOSE)
PACK_HEAD = re.compile(rf"^{PACK}[\s|/,;-]*", re.VERBOSE)

# Sobras de outras colunas escritas dentro do nome.
INLINE_CODE = re.compile(r"\bc[óo]d\.?\s*\d+\b", re.IGNORECASE)
INLINE_EAN = re.compile(r"\b(?:EAN\s*13?|DUN\s*14?)\b\s*\d{8,14}\b", re.IGNORECASE)
BARE_EAN = re.compile(r"\b\d{12,14}\b")
LEADING_DATE = re.compile(rf"^\s*(?:\d{{1,2}}\s+)?(?:{MONTHS})\s+\d{{4}}\s*", re.IGNORECASE)
LEADING_INDEX = re.compile(r"^\s*\d{1,3}(?=\s+\D)")
SPEC_LIKE = re.compile(r"[A-Za-zÀ-ÿ]+:\s*\d")

# Rodape da pagina, que as vezes cai no lugar do titulo.
FOOTER = re.compile(rf"(?:\b(?:{MONTHS})\b\s*\d{{4}}|\bPg\.?\s*\d+)", re.IGNORECASE)
# Glifos sobrepostos na extracao: "MMMaaarrrçççooo", "PPPPgggg....".
GLYPH_NOISE = re.compile(r"(.)\1{2,}")

# Abreviacoes da fonte que ficam obscuras no site.
ABBREVIATIONS = {"trad": "Tradicional"}

# Volume simples ("2L", "500mL"), que qualifica a familia em vez de ser lixo.
VOLUME = re.compile(r"^\d+(?:[.,]\d+)?\s*(?:mL|ml|ML|L|l|g|G|kg|KG)\.?$")

# Nomes que a extracao e o PDF nao resolvem: curados a partir do catalogo.
# A chave e "industria:sku" porque o mesmo codigo aparece em industrias
# diferentes (a Casafort e a Crivialli usam ambas os codigos 11, 19 e 23).
# A pagina citada e onde a informacao foi conferida.
OVERRIDES = {
    # Crivialli, pg. 31: esponja de la de aco vendida em fardo e travesseiro.
    "crivialli:84880": "Esponja de Lã de Aço Magic Brilho Fardo",
    "crivialli:84881": "Esponja de Lã de Aço Magic Brilho Travesseiro",
    # Crivialli, pg. 21: variante que perdeu a familia na extracao.
    "crivialli:84757": "Limpador Perfumado Concentrado Facille Orquídea Negra",
    # H2O, pg. 18: titulo em duas linhas ("Shampoo" / "ANTICASPA").
    "h2o:10012": "Shampoo Anticaspa H2O Clássico",
    "h2o:10013": "Shampoo Anticaspa H2O Hidrata",
    "h2o:10014": "Shampoo Anticaspa H2O Oil Control",
    # H2O, pg. 6: variantes da linha "Shampoo Homem H2O".
    "h2o:10016": "Shampoo Homem H2O Refrescante",
    "h2o:10017": "Shampoo Homem H2O Cabelos Oleosos",
    "h2o:10022": "Shampoo Homem H2O Anticaspa",
    "h2o:10023": "Shampoo Homem H2O Versátil 2 em 1",
    # H2O, pg. 6: gel fixador em frasco e em pote.
    "h2o:10211": "Gel Fixador H2O Na Régua Frasco Fixação Suave",
    "h2o:10212": "Gel Fixador H2O Na Régua Frasco Fixação Forte",
    "h2o:10215": "Gel Fixador H2O Na Régua Frasco Fixação Extra Forte",
    "h2o:10221": "Gel Fixador H2O Pote Fixação Suave",
    "h2o:10222": "Gel Fixador H2O Pote Fixação Forte",
    "h2o:10226": "Gel Fixador H2O Pote Fixação Extra Forte",
    "h2o:10227": "Gel Fixador H2O Pote Cola",
    # H2O, pg. 14: display misto de reparador de pontas.
    "h2o:10197": "Display Reparador de Pontas H2O Misto 24 x 35ml",
    # H2O, pg. 5: a linha Silver so tem shampoo e condicionador.
    "h2o:10018": "Shampoo Silver Homem H2O",
    "h2o:10068": "Condicionador Silver Homem H2O",
    # Crivialli, pg. 14: o titulo da coluna vizinha vazou na recuperacao.
    "crivialli:233": "Limpa Forno & Micro-ondas Perfecto",
    "crivialli:85094": "Limpa Vidros Facille",
    # Crivialli, pg. 21/28: variantes cujo titulo caiu no rodape da pagina.
    "crivialli:84756": "Limpador Perfumado Concentrado Facille Oceano",
    "crivialli:84758": "Limpador Perfumado Concentrado Facille Sortido",
    "crivialli:23": "Amaciante de Roupas Soft Plus Bebê Pedacinho de Céu (Azul)",
    # Crivialli, pg. 25: o texto corrido da pagina caiu no lugar do titulo.
    "crivialli:150": "Desinfetante Clean Plus 500ml Floral",
    "crivialli:151": "Desinfetante Clean Plus 500ml Pinho",
    "crivialli:152": "Desinfetante Clean Plus 500ml Jasmim",
    "crivialli:153": "Desinfetante Clean Plus 500ml Lavanda",
    # Crivialli, pg. 26: titulo da coluna vizinha; o nome esta na propria linha.
    "crivialli:261": "Pedra Sanitária Clean Plus Marine",
    # Crivialli, pg. 5: produto e o higienizador, nao um shampoo.
    "crivialli:425": "Higienizador Banho a Seco Doctor Animal 500ml",
    # Crivialli, pg. 6: ultima coleira da lista perdeu a familia.
    "crivialli:468": "Coleira Doctor Animal N° 8 65cm x 3,2cm",
    # H2O, pg. 20: a linha do kit vizinho vazou junto do nome.
    "h2o:10003": "Shampoo Intense Liss H2O",
    "h2o:10154": "Creme para Pentear Hidra Frizz H2O",
    # H2O, pg. 13: o nome do repelente ja vem completo na linha.
    "h2o:10450": "Repelente de Insetos Éx! Adulto Spray",
    "h2o:10451": "Repelente de Insetos Éx! Kids Spray",
    # H2O, pg. 5: kit da coluna vizinha, nao um desodorante.
    "h2o:10304": "Kit H2O Homem Shampoo + Sabonete Líquido For Men Green",
}

# Produtos sem SKU na origem: a chave e o slug.
OVERRIDES_BY_SLUG = {
    # Oliveira: nome truncado na extracao ("BEIJO DE MOÇ").
    "oliveira-beijo-de-moc": "Doce Beijo de Moça Oliveira",
}


def cap(word: str) -> str:
    """Maiuscula na primeira letra, ignorando pontuacao ("(AZUL" -> "(Azul")."""
    match = re.search(r"[A-Za-zÀ-ÿ]", word)
    if not match:
        return word
    index = match.start()
    return word[:index] + word[index].upper() + word[index + 1 :].lower()


def normalize_measures(token: str) -> str:
    def repl(match: re.Match[str]) -> str:
        amount, unit = match.group(1), match.group(2)
        return amount + UNITS.get(unit, unit.lower())

    return re.sub(r"(\d+(?:[.,]\d+)?)([A-ZÀ-Ú]+)", repl, token)


def title_case_word(word: str, index: int, last: bool) -> str:
    upper = word.upper()

    if upper in ACRONYMS:
        return upper
    # Unidade solta no fim ("... 30CM UN") nao acrescenta informacao.
    if last and upper.strip(".") in BARE_UNITS:
        return ""
    if re.match(r"^\d", word):
        return normalize_measures(word)
    # Codigo colado a medida: PT150L -> Pt150L.
    letters_then_number = re.match(r"^([A-ZÀ-Ú]{1,3})(\d.*)$", word)
    if letters_then_number:
        prefix, rest = letters_then_number.groups()
        return cap(prefix) + normalize_measures(rest)
    if re.search(r"\d", word):
        return word

    lower = word.lower()
    if index > 0 and lower in MINOR_WORDS:
        return lower

    # Compostos com barra ou hifen: P/VARAL -> P/Varal, PIA/WC -> Pia/WC.
    if re.search(r"[/-]", word):
        return re.sub(
            r"[^/-]+",
            lambda m: m.group(0).upper()
            if m.group(0).upper() in ACRONYMS
            else cap(m.group(0)),
            word,
        )

    return cap(word)


def title_case(text: str) -> str:
    """Normaliza cada palavra em CAIXA ALTA, preservando o que ja tem caixa.

    A extracao mistura os dois estilos dentro do mesmo nome ("Shampoo FOR MEN
    GREEN"), entao a decisao e por palavra e nao pela string inteira.
    """
    if not text:
        return text

    words = text.split()
    result = []
    for index, word in enumerate(words):
        if re.search(r"[a-zà-ú]", word):
            result.append(word)
        else:
            result.append(title_case_word(word, index, index == len(words) - 1))
    return " ".join(w for w in result if w)


def fix_artifacts(text: str) -> str:
    for wrong, right in LIGATURES.items():
        text = text.replace(wrong, right)
    # Palavra inteira, para nao transformar "Cocada" ao corrigir "Aco".
    for wrong, right in TYPOS.items():
        text = re.sub(rf"\b{wrong}\b", right, text)
    return text


def strip_pack(text: str) -> str:
    """Remove a embalagem repetida nas pontas, preservando o nome."""
    previous = None
    current = text
    while previous != current:
        previous = current
        for pattern in (PACK_TAIL, PACK_HEAD):
            candidate = pattern.sub("", current).strip(" .,;-|/")
            if len(candidate) >= 3:
                current = candidate
    return current


def is_pack_only(text: str) -> bool:
    """True quando o trecho e apenas embalagem, sem nome de produto."""
    return not re.search(r"[A-Za-zÀ-ÿ]{3,}", strip_pack(text.strip(" .,;-|/")))


def clean_variant(raw: str) -> str:
    """Extrai da extracao original apenas o nome/variante do produto."""
    name = fix_artifacts(raw.replace("\u00a0", " "))
    name = INLINE_EAN.sub(" ", name)
    name = INLINE_CODE.sub(" ", name)
    name = LEADING_DATE.sub("", name)
    name = LEADING_INDEX.sub("", name)

    # "|" e " / " separam colunas. Descartar so os trechos que sao embalagem
    # preserva nomes partidos no meio da linha.
    parts = [p for p in re.split(r"\s*\|\s*|\s+/\s+", name) if p.strip()]
    while len(parts) > 1 and is_pack_only(parts[-1]):
        parts.pop()
    name = " ".join(parts)

    name = strip_pack(name)
    # Embalagem sem a palavra "Cx" no fim do nome ("... BARBA 6X200ML").
    # A unidade e obrigatoria para nao remover "20x1", que a industria usa
    # como parte do nome dos sacos de lixo.
    name = re.sub(
        r"\s*\b\d+\s*[xX×]\s*\d+\s*(?:ml|g|kg|l|un|und)\.?$", "", name, flags=re.I
    )
    name = BARE_EAN.sub(" ", name)
    name = FOOTER.sub(" ", name)
    name = " ".join(w for w in name.split() if not GLYPH_NOISE.search(w))
    name = re.sub(r"\s+", " ", name).strip(" .,;-|/")
    name = " ".join(
        ABBREVIATIONS.get(word.lower().strip("."), word) for word in name.split()
    )
    return title_case(name)


def clean_family(raw: str | None) -> str:
    """Normaliza o titulo de secao vindo do PDF."""
    if not raw:
        return ""
    text = INLINE_EAN.sub(" ", fix_artifacts(raw))
    text = INLINE_CODE.sub(" ", text)
    text = BARE_EAN.sub(" ", text)

    parts = [p.strip() for p in text.split("|") if p.strip()]
    parts = [
        p
        for p in parts
        if not SPEC_LIKE.search(p)
        and not FOOTER.search(p)
        and not GLYPH_NOISE.search(p)
        and (not is_pack_only(p) or VOLUME.match(p))
    ]
    if not parts:
        return ""

    family = parts[0]
    for extra in parts[1:]:
        # O volume distingue produtos da mesma familia (2L, 5L, 500mL).
        if VOLUME.match(extra):
            family += f" {extra}"
        # Qualificador curto em caixa mista e formato (Refil, Gel), nao aroma.
        elif len(extra.split()) <= 2 and re.search(r"[a-zà-ÿ]", extra):
            family += f" {extra}"

    family = strip_pack(family)
    # Titulo que comeca em minuscula e texto corrido da pagina, nao nome.
    if re.match(r"^[a-zà-ÿ]", family):
        return ""

    # O hifen de titulo vira ruido quando a variante e concatenada.
    family = re.sub(r"\s+[-–—]\s+", " ", family)
    family = re.sub(r"\s+", " ", family).strip(" /-–—|.")
    return title_case(family)


def tokens(text: str) -> set[str]:
    return {t.lower() for t in re.findall(r"[A-Za-zÀ-ÿ0-9]+", text)}


def content_words(text: str) -> list[str]:
    """Palavras que carregam significado: ignora unidades e medidas."""
    return [
        word
        for word in re.findall(r"[A-Za-zÀ-ÿ]{2,}", text)
        if word.upper() not in BARE_UNITS and word.upper() not in UNITS
    ]


def is_complete_name(variant: str, brand: str | None) -> bool:
    """True quando a variante ja nomeia o produto e nao precisa da familia.

    Parte do catalogo veio com o nome inteiro na linha ("GEL FIXADOR H2O
    HOMEM"); nesses casos concatenar o titulo da secao so gera redundancia.
    """
    if len(content_words(variant)) < 3:
        return False
    # A marca dentro do nome e o sinal confiavel de que a linha veio completa.
    # Contagem de palavras nao serve: "Festa das Flores (Azul Claro)" e longo
    # mas continua sendo so a variante de um amaciante.
    return bool(tokens(brand or "") & tokens(variant))


def compose(family: str, variant: str, brand: str | None = None) -> str:
    """Junta familia e variante sem repetir palavras."""
    if not family:
        return variant
    if not variant or is_pack_only(variant):
        return family
    if is_complete_name(variant, brand):
        return variant

    # Compara por token para nao repetir "C/Silicone" nem "3,2cm".
    known = tokens(family)
    rest = [word for word in variant.split() if not tokens(word) <= known]
    if not rest:
        return family

    # "Linha Regeneração H2O" + "Shampoo" -> "Shampoo Regeneração H2O".
    if family.lower().startswith("linha ") and rest[0].lower() in LINE_TYPES:
        tail = " ".join(rest[1:])
        base = f"{rest[0]} {family[len('linha '):]}"
        return f"{base} {tail}".strip()

    return f"{family} {' '.join(rest)}"


PACK_SIZE = re.compile(r"(\d+(?:[.,]\d+)?)\s*(mL|ml|ML|L|kg|KG|g|G)\b")


def pack_size(text: str | None) -> str:
    """Ultimo volume citado no texto ("Cx. 12 x 500mL" -> "500ml")."""
    if not text:
        return ""
    found = PACK_SIZE.findall(text)
    if not found:
        return ""
    amount, unit = found[-1]
    return amount + UNITS.get(unit.upper(), unit.lower())


def disambiguate(products: list[dict], sizes: dict[str, str]) -> int:
    """Acrescenta o volume a nomes repetidos dentro da mesma industria.

    O catalogo vende o mesmo item em varios tamanhos e o titulo do PDF nem
    sempre traz o volume, o que deixaria tres produtos com o nome identico.
    """
    groups: dict[tuple[str, str], list[dict]] = {}
    for product in products:
        groups.setdefault((product["industryKey"], product["name"]), []).append(product)

    changed = 0
    for group in groups.values():
        if len(group) < 2:
            continue
        group_sizes = [sizes.get(p["slug"], "") for p in group]
        # So desambigua se o volume realmente separa os produtos.
        if not all(group_sizes) or len(set(group_sizes)) != len(group_sizes):
            continue
        for product, size in zip(group, group_sizes):
            if size.lower() not in product["name"].lower():
                product["name"] = f"{product['name']} {size}"
                changed += 1
    return changed


def repair_pack_label(pack_label: str | None, raw_name: str) -> str | None:
    """Devolve a unidade que a extracao cortou ("Cx. 12 x 1" -> "Cx. 12 x 1L").

    O campo e exibido no card do produto, e o nome bruto da linha guardava a
    especificacao completa.
    """
    if not pack_label:
        return pack_label
    clean = pack_label.strip()
    if not clean.endswith(tuple("0123456789")):
        return clean
    match = re.search(
        re.escape(clean) + r"\s*(mL|ml|ML|L|kg|KG|g|G)\b", raw_name
    )
    return clean + match.group(1) if match else clean


def build_description(name: str, pack_label: str | None, ean: str | None) -> str:
    parts = [f"{name}."]
    if pack_label:
        parts.append(f"Embalagem: {pack_label}.")
    if ean:
        parts.append(f"EAN {ean}.")
    return " ".join(parts)


def clean_brand(raw: str | None) -> str | None:
    if not raw:
        return raw
    return BRAND_OVERRIDES.get(raw.strip().upper(), title_case(raw.strip()))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="grava o arquivo")
    parser.add_argument("--report", action="store_true", help="imprime o diff")
    parser.add_argument("--all", action="store_true", help="mostra todos os nomes")
    parser.add_argument("--limit", type=int, default=40)
    args = parser.parse_args()

    data = json.loads(SOURCE.read_text(encoding="utf8"))
    titles = json.loads(TITLES.read_text(encoding="utf8"))

    ghosts = [p for p in data["products"] if p["slug"] in GHOST_SLUGS]
    data["products"] = [p for p in data["products"] if p["slug"] not in GHOST_SLUGS]

    originals = {p["slug"]: (p["name"], p.get("brand")) for p in data["products"]}

    repaired_packs = 0
    for product in data["products"]:
        sku = str(product.get("sku") or "")
        new_brand = clean_brand(product.get("brand"))
        variant = clean_variant(product["name"])

        pack = repair_pack_label(product.get("packLabel"), product["name"])
        if pack != product.get("packLabel"):
            repaired_packs += 1
        product["packLabel"] = pack
        family = clean_family(titles.get(product["industryKey"], {}).get(sku))

        product["brand"] = new_brand
        product["name"] = (
            OVERRIDES.get(f"{product['industryKey']}:{sku}")
            or OVERRIDES_BY_SLUG.get(product["slug"])
            or fix_artifacts(compose(family, variant, new_brand))
        )

    # O volume aparece na embalagem, no nome bruto ou no titulo do PDF,
    # dependendo de onde a extracao original o deixou.
    sizes = {
        p["slug"]: pack_size(p.get("packLabel"))
        or pack_size(originals[p["slug"]][0])
        or pack_size(titles.get(p["industryKey"], {}).get(str(p.get("sku") or "")))
        for p in data["products"]
    }
    disambiguated = disambiguate(data["products"], sizes)

    changed_names = 0
    changed_brands = 0
    diffs = []
    for product in data["products"]:
        old_name, old_brand = originals[product["slug"]]
        if product["name"] != old_name:
            changed_names += 1
            diffs.append((old_name, product["name"]))
        if product["brand"] != old_brand:
            changed_brands += 1
        product["description"] = build_description(
            product["name"], product.get("packLabel"), product.get("ean")
        )

    for industry in data["industries"]:
        if industry.get("name"):
            industry["name"] = BRAND_OVERRIDES.get(
                industry["name"].strip().upper(), industry["name"]
            )

    print(f"produtos.............. {len(data['products'])}")
    print(f"linhas fantasma....... {len(ghosts)} removidas")
    for ghost in ghosts:
        print(f"   {ghost['slug']} ({ghost['name']!r})")
    print(f"nomes alterados....... {changed_names}")
    print(f"marcas normalizadas... {changed_brands}")
    print(f"volume acrescentado... {disambiguated}")
    print(f"embalagens corrigidas. {repaired_packs}")

    duplicates = {}
    for product in data["products"]:
        duplicates.setdefault(product["name"], []).append(product["sku"])
    repeated = {k: v for k, v in duplicates.items() if len(v) > 1}
    print(f"nomes repetidos....... {len(repeated)}")
    for name, skus in repeated.items():
        print(f"   {name!r} -> skus {skus}")

    unusable = [p for p in data["products"] if is_pack_only(p["name"])]
    weak = [
        p
        for p in data["products"]
        if len(re.findall(r"[A-Za-zÀ-ÿ]{2,}", p["name"])) <= 1
    ]
    print(f"sem nome utilizavel... {len(unusable)}")
    print(f"nomes de 1 palavra.... {len(weak)}")
    for product in unusable + weak:
        print(f"   sku {product['sku']}: {product['name']!r}")

    if args.all:
        for product in data["products"]:
            print(f"  [{product['industryKey']:11s}] {product['name']}")
    elif args.report:
        print("\n=== antes -> depois ===")
        for old, new in diffs[: args.limit]:
            print(f"  - {old}")
            print(f"  + {new}")

    if args.write:
        SOURCE.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf8"
        )
        print(f"\ngravado em {SOURCE}")
    else:
        print("\n(dry-run: nada gravado; use --write para aplicar)")


if __name__ == "__main__":
    main()
