import { useState, useEffect } from 'react';
import AdminSidebar from "../components/AdminSidebar";
import userImg from "../assets/userpic.png";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { BarChart, DoughnutChart } from "../components/Charts";
import { RiCheckboxCircleFill, RiErrorWarningFill } from "react-icons/ri";
import Table from "../components/DashboardTable";
import { DataType } from '../components/DashboardTable';

interface MetricsData {
  totalUniqueUsers: number;
  averageCallsInLast30Days: number;
  averageMetricsLatency: number;
  totalEntries: number;
  totalSuccess: number;
  totalFailures: number;
}
interface EnvData {
  env: string;
  percentage: number;
}

interface GPTModel {
  model: string;
  total_requests: number;
}

const dashboard = () => { 
  const [retrievedData, setData] = useState<MetricsData | null>(null);
  const [topList, setTopList] = useState<DataType[]>([]);
  const [envData, setEnvData] = useState<EnvData[]>([]);
  const [gptModelsData, setGPTModelsData] = useState<GPTModel[]>([]);
  const [percentages, setPercentages] = useState<number[]>([30,2,56,22]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/top-metrics");
        const topList = await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/latest5");
        const envResponse = await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/env");
        const gptData = await fetch(`https://truefoundry-0-0-0-release.onrender.com/dashboard/gpt-models`);
        const percentData = await fetch(`https://truefoundry-0-0-0-release.onrender.com/dashboard/latest-logs`);
        if (!gptData.ok) {
          throw new Error("Failed to fetch GPT models data");
        }
        if (!response.ok || !topList.ok || !envResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        const topListData = await topList.json();
        const envData = await envResponse.json();
        const data2 = await gptData.json();
        const latest=await percentData.json();
        setData(responseData);

        setGPTModelsData(data2);
        setEnvData(envData);
        setTopList(topListData);        
        if (retrievedData) {
          const calculated = [0, 0, 0, 0];
          console.log(retrievedData.totalEntries);
          calculated[0] = ((retrievedData.totalEntries -latest[0]) / retrievedData.totalEntries) * 100;
          calculated[1] = ((retrievedData.totalUniqueUsers -latest[1]) / retrievedData.totalUniqueUsers) * 100;
          calculated[2] = ((retrievedData.averageCallsInLast30Days -latest[2]) / retrievedData.averageCallsInLast30Days) * 100;
          calculated[3] = ((retrievedData.averageMetricsLatency -latest[3]) / retrievedData.averageMetricsLatency) * 100;
          setPercentages(calculated);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="bar">
          <img src={userImg} alt="User" />
          <div>NOTE : Refresh the page to update the graphs and charts</div>
        </div>

        <section className="widget-container">
          <WidgetItem
            percent={percentages[0]}
            amount={true}
            value={retrievedData?.totalEntries ?? 0}
            heading="Total Revenue"
            color="rgb(0,115,255)"
          />
          <WidgetItem
            percent={-percentages[1]}
            value={retrievedData?.totalUniqueUsers ?? 0}
            heading="Users"
            color="rgb(0 198 202)"
          />
          <WidgetItem
            percent={percentages[2]}
            value={retrievedData?.averageCallsInLast30Days ?? 0}
            heading="Calls(30d)"
            color="rgb(255 196 0)"
          />
          <WidgetItem
            percent={percentages[3]}
            value={(retrievedData?.averageMetricsLatency) ?? 0}
            heading="Avg Latency (msec)"
            color="rgb(76 0 255)"
          />
        </section>

        <section className="graph-container">
          {/* <div className="revenue-chart">
            <h2>Monthly API Calls</h2>
            <BarChart
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              data_2={[300, 144, 433, 655, 237, 755, 190]}
              title_1="Revenue"
              title_2="Transaction"
              bgColor_1="rgb(0,115,255)"
              bgColor_2="rgba(53,162,235,0.8)"
            />
          </div> */}

        {
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

          <div className="dashboard-categories">
          <h2>Environment-Wise Distribution</h2>
          <div>
            {envData.map((item) => (
              <CategoryItem
                key={item.env}
                heading={item.env}
                value={(item.percentage)}
                color={`hsl(${item.percentage * 4},${item.percentage}%,50%)`}
              />
            ))}
          </div>
        </div>
        </section>

        <section className="transaction-container">
          <div className="success-chart">
            <h2>API Success Ratio</h2>

            <DoughnutChart
            labels={["Success", "Fails"]} // Updated labels
            data={[retrievedData?.totalSuccess ?? 90, retrievedData?.totalFailures ?? 0]}
            backgroundColor={["rgba(53,162,235,0.8)", "hsl(0, 20%, 50%)"]}
            cutout={90}/>
            <p>
            <RiCheckboxCircleFill />
            <RiErrorWarningFill />

            </p>
          </div>

          <Table data={topList} />
        </section>
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `$${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent}%
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default dashboard;
