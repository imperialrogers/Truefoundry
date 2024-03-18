import React, { useState, useEffect } from 'react';
import AdminSidebar from "../../components/AdminSidebar";
import { LineChart } from "../../components/Charts";
import './BarCharts.css'
import MultiKPISeriesChart from '../../components/MultiKPISeries';

const models=[
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-16k-0613"
];

const BarCharts = () => { 
  const [timeRange, setTimeRange] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [modelData, setModelData] = useState<number[][]>([]);

  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://truefoundry-0-0-0-release.onrender.com/dashboard/line-data?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setChartData(data);
      const promises = models.map(async (model) => {
        const response = await fetch(
            `https://truefoundry-0-0-0-release.onrender.com/dashboard/model-dist?timeRange=${timeRange}&model=${model}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch data for model ${model}`);
          }

          const data = await response.json();
          const totalRequests = data.map((entry: any) => parseInt(entry.average_latency));
          return totalRequests;
        }
        );
        const results = await Promise.all(promises);
        setModelData(results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getLabels = () => {
    switch (timeRange) {
      case 'month':
        return chartData.map((data) => `${months[data.group_key-1]}`);
        break;
      case 'year':
        return chartData.map((data) => data.group_key.toString());
        break;
      case 'hour':
        return chartData.map((data) => `${data.group_key}:00`);
        break;
      case 'day':
        return chartData.map((data) => `Day ${data.group_key}`);
        break;
      case 'quarter':
        return chartData.map((data) => `Q${data.group_key}`);
        break;
      default:
        return [];
    }
  };


  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(event.target.value as 'month' | 'year' | 'hour' | 'day' | 'quarter');
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Time Series Charts</h1>
        <label htmlFor="timeRange" className="select-label">Select Time Range:</label>
        <select id="timeRange" className="select-dropdown" value={timeRange} onChange={handleTimeRangeChange}>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
          <option value="hour">Hourly</option>
          <option value="day">Daily</option>
          <option value="quarter">Quarterly</option>
        </select>
        <section>
          <LineChart
            data={chartData.map((data) => parseInt(data.total_active_users))}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            backgroundColor="rgba(53, 162, 255,0.5)"
            labels={getLabels()}
          />
          <h2>{timeRange}ly Active Users(MAU)</h2>
        </section>
        <section>
          <LineChart
            data={chartData.map((data) => parseInt(data.api_requests))}
            label="Requests"
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={getLabels()}
          />
          <h2>{timeRange}ly API Requests</h2>
        </section>

        <div>
        <h5>***LABELS OF THE GRAPHS ARE BUGGY***</h5>
          <MultiKPISeriesChart dataSets={modelData} models={models} />
        </div>

        <section>
          <h2>MODELWISE LATENCY</h2>
        </section>

      </main>
    </div>
  );
};

export default BarCharts;