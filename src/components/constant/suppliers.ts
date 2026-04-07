import type { Supplier } from "@/types/suppliers";

export type { Supplier };

// Mock data
export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "Fresh Foods Inc",
    contact_person: "Jane Doe",
    email: "info@freshfoods.com",
    phone: "555-0101",
    address: "123 Main St",
    is_active: true,
    created_at: "2024-01-10",
  },
  {
    id: "2",
    name: "Global Imports Ltd",
    contact_person: "John Smith",
    email: "sales@globalimports.com",
    phone: "555-0102",
    address: "456 Oak Ave",
    is_active: true,
    created_at: "2024-01-12",
  },
  {
    id: "3",
    name: "Quality Meats Co",
    contact_person: "Bob Wilson",
    email: "orders@qualitymeats.com",
    phone: "555-0103",
    address: "789 Beef Blvd",
    is_active: false,
    created_at: "2024-01-14",
  },
];
