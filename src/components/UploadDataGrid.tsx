import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

const columns: GridColDef[] = [
  { field: "notValid", headerName: "Not Valid", width: 110 },
  {
    field: "duplicateInFile",
    headerName: "Duplicate In File",
    width: 110,
  },
  {
    field: "dublicateInMongo",
    headerName: "Dublicate In Mongo",
    width: 110,
  },
  {
    field: "data",
    headerName: "Valid data",
    width: 110,
  },
];

export default function AnalysisGrid() {
  const [data, setData] = React.useState([]);
  const [dataLenght, setDataLenght] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const pageChange = (pageInfo) => {};

  return (
    <DataGrid
      sx={{
        margin: 5,
        maxHeight: "90%",
        minHeight: 400,
        maxWidth: "100%",
      }}
      rows={data}
      paginationMode="server"
      rowCount={dataLenght}
      paginationModel={paginationModel}
      columns={columns}
      disableRowSelectionOnClick
      onPaginationModelChange={pageChange}
    />
  );
}
