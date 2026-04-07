export interface CreateSupplierResponse {
  success: boolean;
  message: string;
  data: CreateSupplierPayload;
}

export interface CreateSupplierPayload {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

export interface GetAllSuppliersResponse {
  success: boolean;
  message: string;
  data: Supplier[];
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
  products_count?: number;
}

export interface GetSupplierByIdResponse {
  success: boolean;
  message: string;
  data: SupplierById;
}

export interface SupplierById {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

export interface UpdateSupplierResponse {
  success: boolean;
  message: string;
  data: UpdateSupplierPayload;
}

export interface UpdateSupplierPayload {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

export interface DeleteSupplierResponse {
  success: boolean
  message: string
  data: any
}
