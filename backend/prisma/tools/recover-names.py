#!/usr/bin/env python3
"""Recupera nomes de produto de catalogos PDF usando coordenadas das palavras.

A extracao original pegou apenas a linha de especificacao
("Cx. 12 x 1L cod. 170 EAN13 ...") e perdeu o titulo acima dela. Como os
catalogos tem duas colunas, agrupar por linha de texto nao basta: e preciso
agrupar por coluna usando a posicao x das palavras.

Uso: python3 recover_names.py <saida.json> <catalogo.pdf>
"""

import json
import re
import sys

import pdfplumber

SPEC = re.compile(r"c[óo]d\.?\s*(\d+)", re.IGNORECASE)
PACK_START = re.compile(r"\b(?:C\.?[xX]\.?|CAIXA|FARDO|FD\.?|Pct\.?)\b")
NOISE = re.compile(
    r"^(?:Abril\s+2026|MAR[ÇC]O\s+2024|Pg\.|\d+|DUN14.*|EAN13.*|www\..*|Tabela.*)$",
    re.IGNORECASE,
)


def clusters_for_line(words, gap=18):
    words = sorted(words, key=lambda w: w["x0"])
    groups, current = [], [words[0]]
    for word in words[1:]:
        if word["x0"] - current[-1]["x1"] > gap:
            groups.append(current)
            current = [word]
        else:
            current.append(word)
    groups.append(current)
    return [
        {
            "text": " ".join(w["text"] for w in g),
            "x0": min(w["x0"] for w in g),
            "x1": max(w["x1"] for w in g),
        }
        for g in groups
    ]


def lines_for_page(page):
    words = page.extract_words(use_text_flow=False, keep_blank_chars=False)
    buckets = {}
    for word in words:
        buckets.setdefault(round(word["top"] / 3), []).append(word)
    return [clusters_for_line(buckets[k]) for k in sorted(buckets)]


def overlaps(a, b, tolerance=40):
    return a["x0"] < b["x1"] + tolerance and b["x0"] < a["x1"] + tolerance


def main():
    out_path, pdf_path = sys.argv[1], sys.argv[2]
    recovered = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            lines = lines_for_page(page)
            for index, line in enumerate(lines):
                for cluster in line:
                    match = SPEC.search(cluster["text"])
                    if not match:
                        continue
                    sku = match.group(1)

                    # Variante escrita antes do "Cx." na propria especificacao.
                    variant = PACK_START.split(cluster["text"])[0].strip(" |-–—")
                    variant = SPEC.split(variant)[0].strip(" |-–—")

                    # O titulo fica nas linhas acima que nao contem "cod.".
                    # Linhas com "cod." trazem variantes do produto anterior
                    # ("FLORAL | Cx. ..."), que nao servem como titulo.
                    # Alguns titulos ocupam duas linhas ("Shampoo" / "ANTICASPA"),
                    # entao juntamos as duas primeiras encontradas.
                    parts = []
                    for previous in range(index - 1, max(index - 10, -1), -1):
                        if any(SPEC.search(c["text"]) for c in lines[previous]):
                            continue
                        candidates = [
                            c
                            for c in lines[previous]
                            if overlaps(c, cluster)
                            and not NOISE.match(c["text"].strip())
                            and re.search(r"[A-Za-zÀ-ÿ]{3,}", c["text"])
                        ]
                        if not candidates:
                            continue
                        parts.append(
                            max(candidates, key=lambda c: len(c["text"]))["text"].strip()
                        )
                        break

                    title = " ".join(reversed(parts))
                    name = " | ".join(p for p in (title, variant) if p)
                    if name:
                        recovered.setdefault(sku, {"name": name, "page": page_number})

    json.dump(recovered, open(out_path, "w"), ensure_ascii=False, indent=1)
    print(f"{pdf_path.split('/')[-1]}: {len(recovered)} skus -> {out_path}")


if __name__ == "__main__":
    main()
