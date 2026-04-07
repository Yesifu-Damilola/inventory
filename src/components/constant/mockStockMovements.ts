export type StockMovement = {
  id: string;
  product_id: string;
  product_name: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reference: string;
  notes: string;
  created_at: string;
};

// Temporary mock data used while the backend is being wired up.
export const MOCK_MOVEMENTS: StockMovement[] = [
  {
    id: "1",
    product_id: "1",
    product_name: "Tomatoes",
    type: "in",
    quantity: 100,
    reference: "PO-001",
    notes: "Supplier delivery",
    created_at: "2024-01-20",
  },
  {
    id: "2",
    product_id: "2",
    product_name: "Lettuce",
    type: "out",
    quantity: 25,
    reference: "SO-001",
    notes: "Sales order",
    created_at: "2024-01-20",
  },
  {
    id: "3",
    product_id: "3",
    product_name: "Chicken Breast",
    type: "adjustment",
    quantity: -5,
    reference: "ADJ-001",
    notes: "Inventory adjustment",
    created_at: "2024-01-19",
  },
  {
    id: "4",
    product_id: "4",
    product_name: "Milk",
    type: "in",
    quantity: 50,
    reference: "PO-002",
    notes: "Supplier delivery",
    created_at: "2024-01-19",
  },
];

