import React, { useState } from 'react';

import DashboardCard from './charts/DashboardCard';
import { cpuMetricQuery, memoryMetricQuery, logQuery } from '../grafana/query';
import { useMemoryMetric, useCpuMetric, useLog, applyLog, applyMetric } from '../hooks/useTimeSeriesData';

function Dashboard() {

  const range = 15 * 60 * 1000
  const interval = 10 * 1000

  const projectData = {
    name: "application",
    type: "be",
    environment: "prod",
    team: "xquare"
  }

  const [cpuDatas, cpuTimes, cpuQueryDataProps] = useCpuMetric(projectData)
  const [memoryDatas, memoryTimes, memoryQueryDataProps] = useMemoryMetric(projectData)
  applyMetric(range, interval, [cpuQueryDataProps, memoryQueryDataProps])

  const [logs, logTimes, logQueryDataProps] = useLog(projectData)
  applyLog(range, interval, [logQueryDataProps])

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <DashboardCard title={"CPU"} labels={cpuTimes.map((it) => it.toString())} datas={cpuDatas} />
            <DashboardCard title={"memory"} labels={memoryTimes.map((it) => it.toString())} datas={memoryDatas} />
          </div>
          <div className="mt-[25px]">
            <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
              <div className="px-5 pt-5">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Logs</h2>
              </div>
              <div className="grow h-[328px] pb-[40px]">
                <div className="m-[20px] h-full bg-[#f7f9fc] overflow-scroll ">
                  {logs.map((it) => <>{it}<br/></>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;