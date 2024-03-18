import React, { useState, useEffect } from 'react';
import AdminSidebar from "../../components/AdminSidebar";
import { DoughnutChart, PieChart } from "../../components/Charts";
import "./BarCharts.css";

interface ChartData {
  timeRange: number;
  success_percentage: number;
  prod_env_percentage: number;
  dev_env_percentage: number;
  test_env_percentage: number;
  oth_env_percentage: number;
  gpt_3_5_turbo_percentage: number;
  gpt_3_5_turbo_1106_percentage: number;
  gpt_3_5_turbo_0613_percentage: number;
  gpt_3_5_turbo_0301_percentage: number;
  gpt_3_5_turbo_0125_percentage: number;
  gpt_3_5_turbo_16k_percentage: number; 
  gpt_3_5_turbo_16k_0613_percentage: number;
  openai_engine_percentage: number;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PieCharts = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('month');
  const [selectedRange, setSelectedRange] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://truefoundry-0-0-0-release.onrender.com/dashboard/percentages?timeRange=${selectedTimeRange}&range=${selectedRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedTimeRange, selectedRange]);

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeRange(event.target.value);
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRange(parseInt(event.target.value, 10));
  };

  const formatTimeRange = (timeRange: number, rangeType: string) => {
    switch (rangeType) {
      case 'month':
        return `${monthNames[timeRange - 1]}`;
      case 'quarter':
        return `Quarter ${timeRange}`;
      case 'year':
        return `Year ${timeRange}`;
      case 'hour':
        return `Hour ${timeRange}`;
      case 'day':
        return `Day ${timeRange}`;
      default:
        return `${timeRange}`;
    }
  };

  const filterRanges = () => {
    const ranges = chartData.map(item => item.timeRange);
    const uniqueRanges = [...new Set(ranges)];
    return uniqueRanges;
  };

  const filteredData = chartData.filter(item => item.timeRange === selectedRange);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>PERCENTAGE DISTRIBUTIONS</h1>
        <label htmlFor="groupBy" className="select-label">Select Time Range:</label>
        <select id="groupBy" className="select-dropdown" value={selectedTimeRange} onChange={handleTimeRangeChange}>
          <option value="month">Monthly</option>
          <option value="quarter">Quarterly</option>
          <option value="year">Yearly</option>
        </select>

        <label htmlFor="range" className="select-label">Select {selectedTimeRange}:</label>
        <select id="range" className="select-dropdown" value={selectedRange} onChange={handleRangeChange}>
          <option value={0}>Select {selectedTimeRange}</option>
          {filterRanges().map((range, index) => (
            <option key={index} value={range}>{formatTimeRange(range, selectedTimeRange)}</option>
          ))}
        </select>

        {filteredData.map((item, index) => (
          <section key={index}>
            <div>
              <PieChart
                labels={["SUCCESS", "FAILURE"]}
                data={[item.success_percentage, 100 - item.success_percentage]}
                backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                offset={[0, 80]}
              />
            </div>
            <h2>API SUCCESS RATIO</h2>

            <div>
              <DoughnutChart
                labels={[
                  "PRODUCTION",
                  "DEVELOPMENT",
                  "TESTING",
                  "OTHERS",
                ]}
                data={[
                  item.prod_env_percentage,
                  item.dev_env_percentage,
                  item.test_env_percentage,
                  item.oth_env_percentage,
                ]}
                backgroundColor={[
                  "hsl(110,80%,40%)",
                  "hsl(19,80%,40%)",
                  "hsl(69,80%,40%)",
                  "hsl(300,80%,40%)",
                ]}
                legends={false}
                offset={[20, 30, 20, 30, 80]}
              />
            </div>
            <h2>ENVIRONMENT DISTRIBUTION</h2>

            <div>
              <PieChart
                labels={[
                  "gpt-3.5-turbo",
                  "gpt-3.5-turbo-1106",
                  "gpt-3.5-turbo-0613",
                  "gpt-3.5-turbo-0301",
                  "gpt-3.5-turbo-0125",
                  "gpt-3.5-turbo-16k",
                  "gpt-3.5-turbo-16k-0613",
                ]}
                data={[
                  item.gpt_3_5_turbo_percentage,
                  item.gpt_3_5_turbo_1106_percentage,
                  item.gpt_3_5_turbo_0613_percentage,
                  item.gpt_3_5_turbo_0301_percentage,
                  item.gpt_3_5_turbo_0125_percentage,
                  item.gpt_3_5_turbo_16k_percentage,
                  item.gpt_3_5_turbo_16k_0613_percentage,
                ]}
                backgroundColor={[
                  "hsl(10, 80%, 80%)",
                  "hsl(50, 70%, 70%)",
                  "hsl(110, 60%, 60%)",
                  "hsl(170, 50%, 50%)",
                  "hsl(210, 40%, 40%)",
                  "hsl(260, 30%, 30%)",
                  "hsl(310, 20%, 20%)",
                ]}
                offset={[0, 0, 50, 0, 0, 0, 0]}
              />
            </div>
            <h2>MODEL DEMAND %</h2>

            <div>
              <DoughnutChart
                labels={["OPENAI", "OTHERS"]}
                data={[item.openai_engine_percentage, 100 - item.openai_engine_percentage]}
                backgroundColor={["hsl(335, 100%, 38%)", "hsl(44, 98%, 50%)"]}
                offset={[0, 80]}
              />
            </div>
            <h2>ENGINE DEMAND</h2>
          </section>
        ))}


      </main>
    </div>
  );
};

export default PieCharts;

/**
 * 
 import React, { useState, useEffect } from 'react';
import AdminSidebar from "../../components/AdminSidebar";
import { DoughnutChart, PieChart } from "../../components/Charts";
import "./BarCharts";

interface ChartData {
  month: number;
  success_percentage: number;
  prod_env_percentage: number;
  dev_env_percentage: number;
  test_env_percentage: number;
  oth_env_percentage: number;
  gpt_3_5_turbo_percentage: number;
  gpt_3_5_turbo_1106_percentage: number;
  gpt_3_5_turbo_0613_percentage: number;
  gpt_3_5_turbo_0301_percentage: number;
  gpt_3_5_turbo_0125_percentage: number;
  gpt_3_5_turbo_16k_percentage: number;
  gpt_3_5_turbo_16k_0613_percentage: number;
  openai_engine_percentage: number;
}

const PieCharts = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://truefoundry-0-0-0-release.onrender.com/dashboard/percentages');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setSelectedMonth(selectedMonth);
  };

  const filteredData = chartData.filter(item => item.month === selectedMonth);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>PERCENTAGE DISTRIBUTIONS</h1>
        <label htmlFor="groupBy" className="select-label">Select Month:</label>
        <select id="groupBy" className="select-dropdown" value={selectedMonth || ''} onChange={handleMonthChange}>
          <option value={0}>Select Month</option>
          {chartData.map((item, index) => (
            <option key={index} value={item.month}>{`Month ${item.month}`}</option>
          ))}
        </select>

        {filteredData.map((item, index) => (
          <section key={index}>
            <div>
              <PieChart
                labels={["SUCCESS", "FAILURE"]}
                data={[item.success_percentage, 100 - item.success_percentage]}
                backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                offset={[0, 80]}
              />
            </div>
            <h2>API SUCCESS RATIO</h2>

            <div>
              <DoughnutChart
                labels={[
                  "PRODUCTION",
                  "DEVELOPMENT",
                  "TESTING",
                  "OTHERS",
                ]}
                data={[
                  item.prod_env_percentage,
                  item.dev_env_percentage,
                  item.test_env_percentage,
                  item.oth_env_percentage,
                ]}
                backgroundColor={[
                  "hsl(110,80%,40%)",
                  "hsl(19,80%,40%)",
                  "hsl(69,80%,40%)",
                  "hsl(300,80%,40%)",
                ]}
                legends={false}
                offset={[20, 30, 20, 30, 80]}
              />
            </div>
            <h2>ENVIRONMENT DISTRIBUTION</h2>

            <div>
              <PieChart
                labels={[
                  "gpt-3.5-turbo",
                  "gpt-3.5-turbo-1106",
                  "gpt-3.5-turbo-0613",
                  "gpt-3.5-turbo-0301",
                  "gpt-3.5-turbo-0125",
                  "gpt-3.5-turbo-16k",
                  "gpt-3.5-turbo-16k-0613",
                ]}
                data={[
                  item.gpt_3_5_turbo_percentage,
                  item.gpt_3_5_turbo_1106_percentage,
                  item.gpt_3_5_turbo_0613_percentage,
                  item.gpt_3_5_turbo_0301_percentage,
                  item.gpt_3_5_turbo_0125_percentage,
                  item.gpt_3_5_turbo_16k_percentage,
                  item.gpt_3_5_turbo_16k_0613_percentage,
                ]}
                backgroundColor={[
                  "hsl(10, 80%, 80%)",
                  "hsl(50, 70%, 70%)",
                  "hsl(110, 60%, 60%)",
                  "hsl(170, 50%, 50%)",
                  "hsl(210, 40%, 40%)",
                  "hsl(260, 30%, 30%)",
                  "hsl(310, 20%, 20%)",
                ]}
                offset={[0, 0, 50, 0, 0, 0, 0]}
              />
            </div>
            <h2>MODEL DEMAND %</h2>

            <div>
              <DoughnutChart
                labels={["OPENAI", "OTHERS"]}
                data={[item.openai_engine_percentage, 100 - item.openai_engine_percentage]}
                backgroundColor={["hsl(335, 100%, 38%)", "hsl(44, 98%, 50%)"]}
                offset={[0, 80]}
              />
            </div>
            <h2>ENGINE DEMAND</h2>
          </section>
        ))}
      </main>
    </div>
  );
};

 * 
 */