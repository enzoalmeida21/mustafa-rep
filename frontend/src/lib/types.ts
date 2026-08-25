export type Industry = {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  coverImage?: string | null;
  logoImage?: string | null;
  accentColor: string;
  sortOrder: number;
  active: boolean;
  _count?: { products: number };
  products?: Product[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  active: boolean;
  _count?: { products: number };
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  description: string;
  price: string;
  compareAtPrice?: string | null;
  unit: string;
  packLabel?: string | null;
  ean?: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  active: boolean;
  featured: boolean;
  industryId: string;
  categoryId?: string | null;
  industry?: Industry;
  category?: Category | null;
};

export type OrderStatus =
  | "novo"
  | "em_analise"
  | "confirmado"
  | "enviado"
  | "cancelado";

export type OrderItem = {
  id: string;
  productId?: string | null;
  productName: string;
  unitPrice: string;
  unit: string;
  quantity: number;
  lineTotal: string;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  customerName: string;
  company?: string | null;
  city: string;
  state: string;
  phone: string;
  email: string;
  notes?: string | null;
  total: string;
  createdAt: string;
  items?: OrderItem[];
  whatsappUrl?: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: string;
  unit: string;
  imageUrl?: string | null;
  quantity: number;
};
