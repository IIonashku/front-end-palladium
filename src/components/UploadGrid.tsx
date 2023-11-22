import * as React from "react";
import { dataForUpload, dataForUploadLenght } from "./fileupload.tsx";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "notValid", headerName: "Not Valid", width: 110 },
  {
    field: "duplicateInFile",
    headerName: "Duplicate In File",
    width: 170,
  },
  {
    field: "dublicateInMongo",
    headerName: "Duplicate In Mongo",
    width: 170,
  },
  {
    field: "data",
    headerName: "Valid data",
    width: 110,
  },
  {
    field: "fileName",
    headerName: "Uploaded file",
    width: 310,
  },
];

export default function Upload() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const pageChange = (pageInfo) => {
    setPaginationModel(pageInfo);
  };

  return (
    <DataGrid
      sx={{
        marginBottom: 5,
        minHeight: 150,
        width: "100%",
      }}
      rows={dataForUpload}
      paginationMode="server"
      rowCount={dataForUploadLenght}
      paginationModel={paginationModel}
      columns={columns}
      getRowId={(row) => row.fileName}
      disableRowSelectionOnClick
      onPaginationModelChange={pageChange}
    />
  );
}
