// create units measure
export interface CreateUnitMeasureResponse {
  success: boolean;
  message: string;
  data: CreateUnitMeasurePayload;
}

export interface CreateUnitMeasurePayload {
  name: string;
  abbreviation: string;
}

// get all units measures
export interface GetAllUnitsMeasuresResponse {
  success: boolean;
  message: string;
  data: GetAllUnitsMeasuresData[];
}

export interface GetAllUnitsMeasuresData {
  id: string;
  name: string;
  abbreviation: string;
  created_at: string;
}
// update units measure
export interface UpdateUnitMeasureResponse {
  success: boolean;
  message: string;
  data: UpdateUnitMeasurePayload;
}

export interface UpdateUnitMeasurePayload {
  id: string;
  name: string;
  abbreviation: string;
}

// delete units measure
export interface DeleteUnitMeasureResponse {
  success: boolean;
  message: string;
  data: any;
}
