import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import "./Products.css";

interface DataType {
  id: string;
  user: string;
  status_code: number;
  env: string;
  createdAt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  metricslatency: number;
  inputTokens: number;
  outputTokens: number;
  engine: string;
  n: number;
}

const columns: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "id", 
  },
  {
    Header: "User",
    accessor: "user",
  },
  {
    Header: "Status",
    accessor: "status_code",
  },
  {
    Header: "Environment",
    accessor: "env",
  },
  {
    Header: "CreatedAt",
    accessor: "createdAt",
  },
  {
    Header: "Model",
    accessor: "model",
  },
  {
    Header: "Temperature",
    accessor: "temperature",
  },
  {
    Header: "Max Tokens",
    accessor: "max_tokens",
  },
  {
    Header: "Top P",
    accessor: "top_p",
  },
  {
    Header: "Frequency Penalty",
    accessor: "frequency_penalty",
  },
  {
    Header: "PresencePenalty",
    accessor: "presence_penalty",
  },
  {
    Header: "Latency",
    accessor: "metricslatency",
  },
  {
    Header: "Input Tokens",
    accessor: "inputTokens",
  },
  {
    Header: "Output Tokens",
    accessor: "outputTokens",
  },
  {
    Header: "Engine",
    accessor: "engine",
  },
  {
    Header: "Number",
    accessor: "n",
  },
];

const Products = () => {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    // Fetch data from your backend API
    fetchDataFromAPI();
  }, []);

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const responseData = await response.json();
      setData(responseData); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const Table = useCallback(
    TableHOC<DataType>(
      columns,
      data,
      "dashboard-product-box",
      "Console Logs",
      true
    ),
    [data]
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        <div className="table-container">{Table()}</div>
      </main>
    </div>
  );
};

export default Products;
