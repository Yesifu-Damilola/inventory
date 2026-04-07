export interface CreateStockMovementResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  product: Product;
  user: User;
  type: string;
  quantity: string;
  quantity_before: string;
  quantity_after: string;
  unit_cost: string;
  reference_number: string;
  notes: string;
  occurred_at: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  reorder_level: string;
  cost_price: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface CreateStockMovementPayload {
  product_id: string;
  type: string;
  quantity: number;
  unit_cost: number;
  reference_number: string;
  notes: string;
  occurred_at: string;
}

export interface GetStockMovementByIdResponse {
  success: boolean;
  message: string;
  data: GetStockMovementByIdData;
}

export interface GetStockMovementByIdData {
  id: string;
  product: Product;
  user: User;
  type: string;
  quantity: string;
  quantity_before: string;
  quantity_after: string;
  unit_cost: string;
  reference_number: string;
  notes: string;
  occurred_at: string;
  created_at: string;
}

export interface GetStockMovementByIdProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  reorder_level: string;
  cost_price: string;
  is_active: boolean;
  created_at: string;
}

export interface GetStockMovementByIdUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface GetStockMovementByIdResponse {
  success: boolean;
  message: string;
  data: GetStockMovementByIdData;
}

export interface GetStockMovementByIdData {
  id: string;
  product: Product;
  user: User;
  type: string;
  quantity: string;
  quantity_before: string;
  quantity_after: string;
  unit_cost: string;
  reference_number: string;
  notes: string;
  occurred_at: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  reorder_level: string;
  cost_price: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}
