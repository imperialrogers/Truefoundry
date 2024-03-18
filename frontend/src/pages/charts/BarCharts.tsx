import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { BarChart } from "../../components/Charts";
import "./BarCharts.css";
import StackedBarChart from "./StackedChart";

interface BarChartData {
  group_key: number;
  total_input_tokens: string;
  total_output_tokens: string;
  total_success_count: string;
  total_failure_count: string;
}

interface GPTModel {
  model: string;
  total_requests: number;
}

const models=[
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-16k-0613"
];

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

const BarCharts = () => {
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
  const [gptModelsData, setGPTModelsData] = useState<GPTModel[]>([]);
  const [groupBy, setGroupBy] = useState<'month' | 'year' | 'hour' | 'day' | 'quarter'>('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [modelData, setModelData] = useState<number[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(
          `https://truefoundry-0-0-0-release.onrender.com/dashboard/bar-chart?groupBy=${groupBy}`
        );
        const response2 = await fetch(`https://truefoundry-0-0-0-release.onrender.com/dashboard/gpt-models`);
        if (!response1.ok || !response2.ok) {
          throw new Error("Failed to fetch GPT models data");
        }
        const data1 = await response1.json();
        const data2 = await response2.json();
        setBarChartData(data1);
        setGPTModelsData(data2);
  
        // Stacked Chart Data
        const promises = models.map(async (model) => {
          const response = await fetch(
            `https://truefoundry-0-0-0-release.onrender.com/dashboard/model-dist?timeRange=${groupBy}&model=${model}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch data for model ${model}`);
          }
          const data = await response.json();
  
          let maxIndex;
          if (groupBy === "month") {
            maxIndex = 11;
          } else if (groupBy === "year") {
            maxIndex = 10; // Assuming data is available up to the current year
          } else if (groupBy === "day") {
            maxIndex = new Date(new Date().getFullYear(), 11, 31).getDate(); // Assuming data is available up to December 31st of the current year
          } else if (groupBy === "hour") {
            maxIndex = 23; // Hours are 0-indexed, so the maximum index is 23
          } else if (groupBy === "quarter") {
            maxIndex = 3; // Quarters are 0-indexed, so the maximum index is 3
          }
  
          // Initialize an array with zeros for all possible indices
          const totalRequests = Array(maxIndex + 1).fill(0);
  
          // Update the array with the received data
          data.forEach((entry) => {
            const index = groupBy === "month" ? entry.month : groupBy === "year" ? entry.year : groupBy === "day" ? entry.day : groupBy === "hour" ? entry.hour : entry.quarter;
            if(groupBy==="year")totalRequests[index-2024] = parseInt(entry.total_requests);
            else totalRequests[index-1] = parseInt(entry.total_requests);
          });
  
          return totalRequests;
        });
  
        const results = await Promise.all(promises);
        setModelData(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [groupBy]);
  const getLabels = () => {
    switch (groupBy) {
      case 'month':
        return barChartData.map((data) => `${months[data.group_key-1]}`);
      case 'year':
        return barChartData.map((data) => data.group_key.toString());
      case 'hour':
        return barChartData.map((data) => `${data.group_key}:00`);
      case 'day':
        return barChartData.map((data) => `Day ${data.group_key}`);
      case 'quarter':
        return barChartData.map((data) => `Q${data.group_key}`);
      default:
        return [];
    }
  };

  const handleGroupByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGroupBy(event.target.value as 'month' | 'year' | 'hour' | 'day' | 'quarter');
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>STATISTICAL CHARTS</h1>
        <div className="select-container">
          <label htmlFor="groupBy" className="select-label"></label>
          <select id="groupBy" className="select-dropdown" value={groupBy} onChange={handleGroupByChange}>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
        <section>
          <BarChart
            data_1={barChartData.map((data) => parseInt(data.total_input_tokens))}
            data_2={barChartData.map((data) => parseInt(data.total_output_tokens))}
            title_1="Input Tokens"
            title_2="Output Tokens"
            bgColor_1={`hsl(260,50%,30%)`}
            bgColor_2={`hsl(360,90%,90%)`}
            labels={getLabels()}
          />
          <h2>TOKEN USAGE</h2>
        </section>
        { !loading && // Only render the GPT model distribution chart if data is not loading
          <section>
            <BarChart
              data_1={gptModelsData.map((model) => model.total_requests)}
              title_1="API CALLS"
              bgColor_1={`hsl(240, 40%, 50%)`}
              labels={gptModelsData.map((model) => model.model)}
              data_2={[]}
              title_2={""}
              bgColor_2={""}
            />
            <h2>AGGREGRATE GPT MODEL DISTRIBUTION</h2>
          </section>
        }
        {loading ? (
          <p>Loading...</p>
        ) : (
          <StackedBarChart
              data={modelData}
              labels={getLabels()} 
              datasetLabels={models}/>
        )}

        <section>
          <h2>MODELS DISTRIBUTION</h2>
          <BarChart
            horizontal={false}
            data_1={barChartData.map((data) => parseInt(data.total_success_count))}
            data_2={barChartData.map((data) => parseInt(data.total_failure_count))}
            title_1="Success"
            title_2="Failures"
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2={`hsl(0, 40%, 50%)`}
            labels={getLabels()}
          />
          <h2>SUCCESS STATISTICS</h2>
        </section>
      </main>
    </div>
  );
};

export default BarCharts;