import { Column } from "react-table";
import TableHOC from "./TableHOC";

export interface DataType {
  user: string;
  createdAt: string;
  input: string;
  output: string;
  status_code: number;
}

const columns: Column<DataType>[] = [
  {
    Header: "User",
    accessor: "user",
  },
  {
    Header: "Time",
    accessor: "createdAt",
  },
  {
    Header: "Input",
    accessor: "input",
  },
  {
    Header: "Ouput",
    accessor: "output",
  },
  {
    Header: "Status",
    accessor: "status_code",
  },
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
  return TableHOC<DataType>(
    columns,
    data,
    "transaction-box",
    "Recent Calls"
  )();
};

export default DashboardTable;
