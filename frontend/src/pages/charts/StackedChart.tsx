import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface StackedBarChartProps {
  data: number[][];
  labels: string[];
  datasetLabels: string[];
  backgroundColors?: string[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  labels,
  datasetLabels,
  backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)', 
  ],
}) => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const barChartData: ChartData<'bar', number[], string> = {
    labels,
    datasets: data.map((dataset, index) => ({
      label: datasetLabels[index],
      data: dataset,
      backgroundColor: backgroundColors[index],
    })),
  };

  return <Bar options={options} data={barChartData} />;
};

export default StackedBarChart;
