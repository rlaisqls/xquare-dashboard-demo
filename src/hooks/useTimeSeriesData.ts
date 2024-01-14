import { useState, useEffect, useRef } from 'react';
import { queryLog, queryMetric } from '../apis/metric/query';
import { getRefId } from '../utils/utils';
import { cpuMetricQuery, logQuery, memoryMetricQuery, projectProps } from '../grafana/query';
import { GrafanaQueryResponse } from '../apis/metric/response';

type SetDatas<T> = React.Dispatch<React.SetStateAction<T[]>>
type SetTimes = React.Dispatch<React.SetStateAction<Date[]>>

interface QueryDataProps<T> {
  query: string,
  datas: T[],
  setDatas: SetDatas<T>,
  times: Date[],
  setTimes: SetTimes,
}

// logs ========================================

export const applyLog = <T>(range: number, interval: number, queryDataProps: QueryDataProps<T>[]) => {
  applyTimeSeriesDataQuery(
    range, interval, queryDataProps,
    queryLog,
    (it, res) => {
      const values = res.results[it.refId].frames[0].data.values;
      it.setTimes([...it.times, ...values[1] as Date[]])
      it.setDatas([...it.datas, ...values[2] as T[]])
    }
  )
}

export const useLog = (props: projectProps): [string[], Date[], QueryDataProps<string>] => {
  return useTimeSeriesData<string>(logQuery(props))
}

// metrics ========================================

export const applyMetric = <T>(range: number, interval: number, queryDataProps: QueryDataProps<T>[]) => {
  applyTimeSeriesDataQuery(
    range, interval, queryDataProps,
    queryMetric,
    (it, res) => {
      const values = res.results[it.refId].frames[0].data.values;
      console.log(it.times)
      console.log(it.datas)
      it.setTimes([...it.times, ...values[0] as Date[]])
      it.setDatas([...it.datas, ...values[1] as T[]])
    }
  )
}

export const useCpuMetric = (props: projectProps): [number[], Date[], QueryDataProps<number>] => {
  return useTimeSeriesData<number>(cpuMetricQuery(props))
}

export const useMemoryMetric = (props: projectProps): [number[], Date[], QueryDataProps<number>] => {
  return useTimeSeriesData<number>(memoryMetricQuery(props))
}

// utils ========================================

const useTimeSeriesData = <T>(query: string): [T[], Date[], QueryDataProps<T>] => {
  const [datas, setDatas] = useState<T[]>([]);
  const [times, setTimes] = useState<Date[]>([]);

  const queryDataProps = {
    query: query,
    datas: datas,
    setDatas: setDatas,
    times: times,
    setTimes: setTimes,
  }

  return [
    datas,
    times,
    queryDataProps
  ];
};

type BulkQueryFunction = (from: Date, to: Date) => Promise<GrafanaQueryResponse>;

const applyTimeSeriesDataQuery = <T>(
  range: number, interval: number, queryDataProps: QueryDataProps<T>[],
  query: (queries: string[]) => BulkQueryFunction,
  setData: (QueryDataProps, GrafanaQueryResponse) => void
) => {
  const now = new Date()
  const [lastQueryTime, setLastQueryTime] = useState<Date>(new Date(now.getTime() - range));

  const queryDatas = queryDataProps.map((queryDataProps, idx) => ({
    ...queryDataProps,
    refId: getRefId(idx),
  }));
  const bulkQuery = query(queryDatas.map((it) => it.query))

  useInterval(async () => {
    const now = new Date()
    await bulkQuery(lastQueryTime, now).then((res) => {
      setLastQueryTime(new Date())
      queryDatas.forEach((it) => {
        setData(it, res)
      })
    })
  }, interval)
}

const useInterval = (callback: () => void, delay: number | null): void => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}