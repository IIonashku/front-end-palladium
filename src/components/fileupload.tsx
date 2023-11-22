import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { backEndUrl } from "../config.ts";
import AnalysisGrid from "./UploadDataGrid.tsx";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { string } from "prop-types";

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

type analisis = {
  notValid: number;
  duplicateInFile: number;
  dublicateInMongo: number;
  data: number;
  fileName: string;
};

export default function UploadForm() {
  const [files, setFiles] = useState<FileList | []>([]);

  const handleFileSelection = (event: React.FormEvent) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      setFiles(files);
    }
  };

  const [data, setData] = React.useState([]);
  const [dataLenght, setDataLenght] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const pageChange = (pageInfo) => {};

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i += 1) {
      formData.append("files", files[i]);
    }
    axios
      .post(backEndUrl + "/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
        const result: [] = res.data.result;
        const analisys: any = [];
        result.forEach((analis: any) => {
          const newData = {
            notValid: analis[0].notValid,
            duplicateInFile: analis[0].duplicateInFile,
            dublicateInMongo: analis[0].dublicateInMongo,
            data: analis[0].data,
            fileName: analis[1],
          };
          analisys.push(newData);
        });
        setData(analisys);
        setDataLenght(analisys.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Box sx={{ display: "inline-table" }}>
      <DataGrid
        sx={{
          margin: 5,
          minHeight: 400,
          maxWidth: "100%",
          color: "white",
        }}
        rows={data}
        paginationMode="server"
        rowCount={dataLenght}
        paginationModel={paginationModel}
        columns={columns}
        getRowId={(row) => row.fileName}
        disableRowSelectionOnClick
        onPaginationModelChange={pageChange}
      />
      <form>
        <input
          type="file"
          multiple
          accept="text/csv"
          onChange={(e) => handleFileSelection(e)}
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "#1565c0" }}
          onClick={handleUpload}
          component="span">
          Upload
        </Button>
      </form>
    </Box>
  );
}
