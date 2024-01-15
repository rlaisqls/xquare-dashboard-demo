import React, { useRef, useEffect, useState } from 'react';
import { chartColors } from './ChartjsConfig';
import { formatBytes } from '../../utils/utils';

import { LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, zoomPlugin);

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
        responsive: true,
        chartArea: {
          backgroundColor: chartAreaBg.light,
        },
        layout: {
          padding: 20,
        },
        zoom: {
          pan: { // 마우스로 잡아서 그래프 이동
            enabled: true,
            mode: 'x'
          },
          zoom: {
            wheel: {
              enabled: true
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (idx) => new Date(+data.labels[idx]).toTimeString().split(' ')[0]
            },
            display: true,
            title: {
              display: true
            }
          },
          y: {
            ticks: {
              callback: (val) => (formatBytes(val))
            },
            display: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => `${parseFloat(context.parsed.y.toFixed(5))
                }`,
            },
          },
          legend: {
            display: false,
          },
          zoom: {
              pan: { // 마우스로 잡아서 그래프 이동
                  enabled: true,
                  mode: 'x'
              },
              zoom: {
                  wheel: {
                      enabled: true
                  }
              }
          }
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
  }, [data]);

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default LineChart;