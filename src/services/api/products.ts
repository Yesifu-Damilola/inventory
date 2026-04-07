import {
  CreateProductsPayload,
  CreateProductsResponse,
  UpdateProductsPayload,
  UpdateProductsResponse,
} from "@/types/products";
import { axiosPrivate } from "../axios/axiosPrivate";

export interface GetAllProductsParams {
  category_id?: string;
  supplier_id?: string;
  search?: string;
  per_page?: number;
}

export const productsApi = {
  // get all Products
  getAllProducts: async (params?: GetAllProductsParams) => {
    const res = await axiosPrivate.get("/products", { params });
    return res.data;
  },
  // create products
  createProducts: async (
    payload: CreateProductsPayload,
  ): Promise<CreateProductsResponse> => {
    const res = await axiosPrivate.post<CreateProductsResponse>(
      "/products",
      payload,
    );
    return res.data;
  },
  // get product by id
  getProductById: async (productId: string) => {
    const res = await axiosPrivate.get(`/products/${productId}`);
    return res.data;
  },
  //  update product by id
  updateProduct: async (
    productId: string,
    payload: UpdateProductsPayload,
  ): Promise<UpdateProductsResponse> => {
    const res = await axiosPrivate.put<UpdateProductsResponse>(
      `/products/${productId}`,
      payload,
    );
    return res.data;
  },
  // delete product by id
  deleteProduct: async (productId: string) => {
    const res = await axiosPrivate.delete(`/products/${productId}`);
    return res.data;
  },
  // get low stock products
  getLowStockProducts: async () => {
    const res = await axiosPrivate.get("/products/low-stock");
    return res.data;
  },
};
