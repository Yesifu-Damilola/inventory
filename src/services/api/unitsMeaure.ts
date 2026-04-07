import { axiosPrivate } from "../axios/axiosPrivate";
import {
  UpdateUnitMeasurePayload,
  type CreateUnitMeasurePayload,
  type CreateUnitMeasureResponse,
  type GetAllUnitsMeasuresResponse,
} from "@/types/unitsMeasure";

export const unitsMeaureApi = {
  getAllUnitsMeasures: async (): Promise<GetAllUnitsMeasuresResponse> => {
    const res =
      await axiosPrivate.get<GetAllUnitsMeasuresResponse>("/units-of-measure");
    return res.data;
  },
  // create unit measure
  createUnitMeasure: async (
    payload: CreateUnitMeasurePayload,
  ): Promise<CreateUnitMeasureResponse> => {
    const res = await axiosPrivate.post<CreateUnitMeasureResponse>(
      "/units-of-measure",
      payload,
    );
    return res.data;
  },
  // get unit measure by id
  getUnitMeasureById: async (unit_of_measure: string) => {
    const res = await axiosPrivate.get(`/units-of-measure/${unit_of_measure}`);
    return res.data;
  },

  // update unit measure
  updateUnitMeasure: async (
    unit_of_measure: string,
    payload: UpdateUnitMeasurePayload,
  ) => {
    const res = await axiosPrivate.put(
      `/units-of-measure/${unit_of_measure}`,
      payload,
    );
    return res.data;
  },
  // delete unit measure
  deleteUnitMeasure: async (unit_of_measure: string) => {
    const res = await axiosPrivate.delete(
      `/units-of-measure/${unit_of_measure}`,
    );
    return res.data;
  },
};
