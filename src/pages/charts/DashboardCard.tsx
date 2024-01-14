import React from 'react';
import LineChart from './LineChart';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/utils';

interface Props {
  title: string
  labels: string[]
  datas: number[]
}

function DashboardCard({title, labels, datas}: Props) {

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: datas,
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h2>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard;
