import { Decimal } from "@prisma/client/runtime/library";

export function toMoney(value: Decimal | number | string) {
  return new Decimal(value).toFixed(2);
}

export function serializeProduct<
  T extends { price: Decimal; compareAtPrice?: Decimal | null },
>(product: T) {
  return {
    ...product,
    price: toMoney(product.price),
    compareAtPrice:
      product.compareAtPrice != null ? toMoney(product.compareAtPrice) : null,
  };
}

export function serializeOrderItem<
  T extends { unitPrice: Decimal; lineTotal: Decimal },
>(item: T) {
  return {
    ...item,
    unitPrice: toMoney(item.unitPrice),
    lineTotal: toMoney(item.lineTotal),
  };
}

export function serializeOrder<
  T extends {
    total: Decimal;
    items?: Array<{ unitPrice: Decimal; lineTotal: Decimal }>;
  },
>(order: T) {
  return {
    ...order,
    total: toMoney(order.total),
    items: order.items?.map(serializeOrderItem),
  };
}
