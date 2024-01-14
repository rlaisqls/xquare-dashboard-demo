
export interface GrafanaQueryResponse {
  results: Results;
}

export interface Results {
  [key: string]: {
      status: number;
      frames: {
        schema: {
          refId: string;
          meta: {
            type: string;
            typeVersion: number[];
            stats: {
              displayName: string;
              unit?: string;
              value: number;
            }[];
            executedQueryString: string;
          };
          fields: {
            name: string;
            type: string;
            typeInfo: {
              frame: string;
            };
          }[];
        };
        data: {
          values: (string[] | number[] | Date[] | LogLabel[])[];
          nanos: (number | null)[];
        };
      }[];
  };
}

export interface LogLabel {
  app: string;
  container: string;
  filename: string;
  job: string;
  namespace: string;
  node_name: string;
  pod: string;
  stream: string;
}