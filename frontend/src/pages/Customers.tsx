import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Column } from "react-table";
import TableHOC from "../components/TableHOC";

interface UserData {
  user: string;
  request_count: string;
  total_input_tokens: string;
  total_output_tokens: string;
  env: string;
}

const columns: Column<UserData>[] = [
  {
    Header: "User",
    accessor: "user",
  },
  {
    Header: "Request Count",
    accessor: "request_count",
  },
  {
    Header: "Total Input Tokens",
    accessor: "total_input_tokens",
  }, 
  {
    Header: "Total Output Tokens",
    accessor: "total_output_tokens",
  },
  {
    Header: "Environment",
    accessor: "env",
  },
];

const Customers = () => {
  const [data, setData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/users");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const userData = await response.json();
        setData(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const Table = TableHOC<UserData>(
    columns,
    data,
    "dashboard-product-box",
    "Customers",
    true
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table()}</main>
    </div>
  );
};

export default Customers;
