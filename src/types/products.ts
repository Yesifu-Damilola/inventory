export interface CreateProductsResponse {
  success: boolean;
  message: string;
  data: Product;
}

/** POST /products body (matches API contract) */
export interface CreateProductsPayload {
  name: string;
  sku: string;
  description: string;
  category_id: string;
  unit_of_measure_id: string;
  reorder_level: number;
  cost_price: number;
  is_active: boolean;
  supplier_ids: string[];
}

export interface UpdateProductsPayload {
  name: string;
  sku: string;
  description: string;
  category_id: string;
  unit_of_measure_id: string;
  reorder_level: number;
  cost_price: number;
  is_active: boolean;
  supplier_ids: string[];
}

export interface UpdateProductsResponse {
  success: boolean;
  message: string;
  data: UpdateProductsData;
}

export interface UpdateProductsData {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: Category;
  unit_of_measure: UnitOfMeasure;
  reorder_level: string;
  cost_price: string;
  is_active: boolean;
  stock_level: StockLevel;
  suppliers: Supplier[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
}

export interface StockLevel {
  quantity_on_hand: string;
  last_updated_at: any;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: Category;
  unit_of_measure: UnitOfMeasure;
  reorder_level: string;
  cost_price: string;
  is_active: boolean;
  stock_level: StockLevel;
  suppliers: Supplier[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
}

export interface StockLevel {
  quantity_on_hand: string;
  last_updated_at: any;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

// Table row shape used by the Products UI.
// This is intentionally a simplified view of the backend `Product` contract.
export interface ProductRow {
  id: string;
  name: string;
  sku: string;
  description: string;
  category_id: string;
  category_name: string;
  unit_id: string;
  unit_name: string;
  unit_abbreviation: string;
  supplier_id: string;
  cost: number;
  reorder_level: number;
  quantity_on_hand: number;
  stock_last_updated_at: string | null;
  is_active: boolean;
  created_at: string;
}

/** List row for low-stock alerts (includes current quantity for comparison). */
export interface LowStockProductRow extends ProductRow {
  quantity_on_hand: number;
  category_name: string;
  unit_name: string;
  unit_abbreviation: string;
}

export interface GetLowStockProductsResponse {
  success: boolean;
  message: string;
  data: LowStockProduct[];
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: Category;
  unit_of_measure: UnitOfMeasure;
  reorder_level: string;
  cost_price: string;
  is_active: boolean;
  stock_level: StockLevel;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
}

export interface StockLevel {
  quantity_on_hand: string;
  last_updated_at: any;
}
