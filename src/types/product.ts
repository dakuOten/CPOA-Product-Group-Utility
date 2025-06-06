export interface ProductItem {
  id: string;
  name: string;
  type: string;
  quantity?: number;
  terms?: string;
  unitPrice?: number;
  totalPricing?: number | string;
  vendor?: string | null;
  productGrouping?: string | null;
  isContract?: boolean;
}

export interface ProductFormData extends ProductItem {
  dealId: string;
}