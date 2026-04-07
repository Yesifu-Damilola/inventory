import { AuthRole } from "./user";

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data: CreateCategoryPayload;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  role: AuthRole;
}

export interface GetAllCategoriesResponse {
  success: boolean
  message: string
  data: Category[]
}

export interface Category {
  id: string
  name: string
  description: string
  products_count: number
  created_at: string
}

export interface UpdateCategoryResponse {
  success: boolean;
  message: string;
  data: UpdateCategoryPayload;
}

export interface UpdateCategoryPayload {
  id: string;
  name: string;
  description: string;
}

export interface DeleteCategoryResponse {
  success: boolean
  message: string
  data: any
}
