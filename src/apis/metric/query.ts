import axios, { AxiosError } from 'axios';
import { MutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import { GrafanaQueryResponse } from './response';
import { getRefId } from '../../utils/utils';

const instance = axios.create({
  baseURL: `https://tsdata.xquare.app`,
  timeout: 10000,
});

type BulkQueryFunction = (from: Date, to: Date) => Promise<GrafanaQueryResponse>;

export const queryLog = (queries: string[]): BulkQueryFunction => {
  return callQueryAPI(queries, "loki")
}

export const queryMetric = (queries: string[]): BulkQueryFunction => {
  
  return callQueryAPI(queries, "prometheus")
}

const callQueryAPI = (queries: string[], datasoruce: string) => {
  return async (from: Date, to: Date) => {
    const { data } = await instance.post<GrafanaQueryResponse>(
      `/api/ds/query`,
      requestToQuery(queries, from, to, datasoruce),
    );
    return data
  };
}

const requestToQuery = (queries: string[], from: Date, to: Date, dataSource: string) => {
  return {
    from: `${from.getTime()}`,  
    to: `${to.getTime()}`,
    queries: queries.map((request, idx) => {
      return {
        expr: request,
        hide: false,
        refId: getRefId(idx),
        datasource: dataSource,
        queryType: "range"
      }
    })
  };
}