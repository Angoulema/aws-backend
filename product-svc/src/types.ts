export interface Product {
  productId: string;
  productName: string;
  productType: string;
  price: number;
  currency: string;
  description?: string;
}

export interface Stock {
  id: string;
  count: number;
}

export type ProductRepresentation = Product & Omit<Stock, 'id'>;
