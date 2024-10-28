export interface IGeocodingResponse {
  results: Array<{
    geometry: {
      lat: number;
      lng: number;
    };
    components: {
      country: string;
      [key: string]: any;
    };
    annotations?: {
      [key: string]: any;
    };
    [key: string]: any;
  }>;
  status: {
    code: number;
    message: string;
  };
  rate: {
    limit: number;
    remaining: number;
    reset: number;
  };
  [key: string]: any;
}
