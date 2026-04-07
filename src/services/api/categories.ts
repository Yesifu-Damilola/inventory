import {
  CreateCategoryPayload,
  CreateCategoryResponse,
  GetAllCategoriesResponse,
  UpdateCategoryPayload,
} from "@/types/categories";
import { axiosPrivate } from "../axios/axiosPrivate";

export const categoriesApi = {
  getAllCategories: async (): Promise<GetAllCategoriesResponse> => {
    const res = await axiosPrivate.get<GetAllCategoriesResponse>("/categories");
    return res.data;
  },

  createCategory: async (
    payload: CreateCategoryPayload,
  ): Promise<CreateCategoryResponse> => {
    const res = await axiosPrivate.post<CreateCategoryResponse>(
      "/categories",
      payload,
    );
    return res.data;
  },

  getCategoryById: async (categoryId: string) => {
    const res = await axiosPrivate.get(`/categories/${categoryId}`);
    return res.data;
  },

  updateCategory: async (
    categoryId: string,
    payload: UpdateCategoryPayload,
  ) => {
    const res = await axiosPrivate.patch(`/categories/${categoryId}`, payload);
    return res.data;
  },

  deleteCategory: async (categoryId: string) => {
    const res = await axiosPrivate.delete(`/categories/${categoryId}`);
    return res.data;
  },
};
