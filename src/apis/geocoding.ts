import { openCageClient } from "./client";
import { IGeocodingResponse } from "../types/geocoding-type";
import { urls } from "./urls";

interface IFetchGeocoding {
  query: string;
}

export const fetchGeocoding = async (
  params: IFetchGeocoding
): Promise<IGeocodingResponse> => {
  const response = await openCageClient.get<IGeocodingResponse>(
    urls.geocoding.forward,
    {
      params: {
        key: "04a6b2ec6abe46259181116f49666cbb",
        q: params.query,
        limit: 1,
      },
    }
  );
  return response.data;
};
