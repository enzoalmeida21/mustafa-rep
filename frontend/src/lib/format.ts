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
