export interface MockProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  category_id: string;
  unit_id: string;
  supplier_id: string;
  cost: number;
  reorder_level: number;
  created_at: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Tomatoes",
    sku: "TMAT001",
    description: "Fresh tomatoes",
    category_id: "1",
    unit_id: "1",
    supplier_id: "1",
    cost: 2.5,
    reorder_level: 50,
    created_at: "2024-01-15",
  },
  {
    id: "2",
    name: "Lettuce",
    sku: "LETT001",
    description: "Green lettuce leaves",
    category_id: "1",
    unit_id: "1",
    supplier_id: "1",
    cost: 1.5,
    reorder_level: 30,
    created_at: "2024-01-16",
  },
  {
    id: "3",
    name: "Chicken Breast",
    sku: "CHKB001",
    description: "Boneless chicken breast",
    category_id: "4",
    unit_id: "1",
    supplier_id: "3",
    cost: 8.0,
    reorder_level: 20,
    created_at: "2024-01-17",
  },
  {
    id: "4",
    name: "Milk",
    sku: "MILK001",
    description: "Dairy milk product",
    category_id: "3",
    unit_id: "3",
    supplier_id: "2",
    cost: 1.8,
    reorder_level: 100,
    created_at: "2024-01-18",
  },
];
