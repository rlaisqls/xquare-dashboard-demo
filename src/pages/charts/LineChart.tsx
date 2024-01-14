import React, { useRef, useEffect, useState } from 'react';
import { chartColors } from './ChartjsConfig';
import { LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,} from 'chart.js';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

// Import utilities
import { formatValue } from '../../utils/utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

interface Props {
  data: any
  width: number
  height: number
}

export const LineChart = ({
  data, width, height
}: Props) => {
  const [chart, setChart] = useState<Chart>(null)
  const canvas = useRef(null);
  const { chartAreaBg } = chartColors; 

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        chartArea: {
          backgroundColor:chartAreaBg.light,
        },
        layout: {
          padding: 20,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true
            }
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => formatValue(context.parsed.y),
            },
          },
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default LineChart;