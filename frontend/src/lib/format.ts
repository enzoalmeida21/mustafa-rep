const UNIT_ALIASES = /^(unid\.?|un\.?|und\.?|unidade|unidades)$/i;

/** Unidade comercial da Mustafá: venda somente em caixas. */
export function formatSaleUnit(unit?: string | null) {
  const raw = unit?.trim() ?? "";
  if (!raw || UNIT_ALIASES.test(raw)) return "cx";
  return raw;
}

export function formatSaleQty(quantity: number, unit?: string | null) {
  return `${quantity} ${formatSaleUnit(unit)}`;
}

export function hasListPrice(value: string | number | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(amount) && amount > 0;
}

export function formatBRL(value: string | number) {
  if (!hasListPrice(value)) return "Sob consulta";
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

const MINOR_WORDS = new Set([
  "a", "as", "ao", "aos", "com", "da", "das", "de", "do", "dos", "e", "em",
  "no", "nos", "na", "nas", "o", "os", "para", "por", "sem",
]);

const UNITS: Record<string, string> = {
  CM: "cm", G: "g", KG: "kg", L: "L", M: "m", MG: "mg", MM: "mm",
  ML: "ml", PC: "pc", PCS: "pcs", UN: "un", UNID: "unid",
};

function normalizeMeasures(token: string) {
  return token.replace(
    /(\d+(?:[.,]\d+)?)([A-ZÀ-Ú]+)/g,
    (_, amount: string, unit: string) => amount + (UNITS[unit] ?? unit.toLowerCase()),
  );
}

/**
 * Parte do catálogo vem em CAIXA ALTA das planilhas das indústrias, o que
 * destoa dos nomes já formatados. A conversão só acontece quando o nome não
 * tem nenhuma minúscula, preservando o que a indústria escreveu com intenção.
 */
export function formatProductName(name: string) {
  const clean = name.trim().replace(/\s+/g, " ");
  if (!clean || /[a-zà-ú]/.test(clean)) return clean;

  return clean
    .split(" ")
    .map((word, index) => {
      // Só medidas começam com dígito. Marcas e códigos (H2O, P04) ficam intactos.
      if (/^\d/.test(word)) return normalizeMeasures(word);
      if (/\d/.test(word)) return word;
      const lower = word.toLocaleLowerCase("pt-BR");
      if (index > 0 && MINOR_WORDS.has(lower)) return lower;
      return lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);
    })
    .join(" ");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  confirmado: "Confirmado",
  enviado: "Enviado",
  cancelado: "Cancelado",
};
