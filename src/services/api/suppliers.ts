import {
  CreateSupplierPayload,
  CreateSupplierResponse,
  GetAllSuppliersResponse,
  UpdateSupplierPayload,
} from "@/types/suppliers";
import { axiosPrivate } from "../axios/axiosPrivate";

export type GetSuppliersParams = {
  per_page?: number;
  // page?: number; // optional for pagination
};
export const suppliersApi = {
  // get all suppliers
  getAllSuppliers: async (
    params: GetSuppliersParams,
  ): Promise<GetAllSuppliersResponse> => {
    const res = await axiosPrivate.get<GetAllSuppliersResponse>("/suppliers", {
      params,
    });
    return res.data;
  },

  // create a suppliers
  createSupplier: async (
    payload: CreateSupplierPayload,
  ): Promise<CreateSupplierResponse> => {
    const res = await axiosPrivate.post<CreateSupplierResponse>(
      "/suppliers",
      payload,
    );
    return res.data;
  },
  // get supplier by id
  getSupplierById: async (supplierId: string) => {
    const res = await axiosPrivate.get(`/suppliers/${supplierId}`);
    return res.data;
  },
  // update supplier
  updateSupplier: async (
    supplierId: string,
    payload: Partial<UpdateSupplierPayload>,
  ) => {
    const res = await axiosPrivate.put(`/suppliers/${supplierId}`, payload);
    return res.data;
  },
  // delete supplier by id
  deleteSupplier: async (supplierId: string) => {
    const res = await axiosPrivate.delete(`/suppliers/${supplierId}`);
    return res.data;
  },
};
