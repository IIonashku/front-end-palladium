import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";
import axios from "axios";
import { backEndUrl } from "../config.ts";
import "react-toastify/dist/ReactToastify.css";

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
  const [status, setStatus] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [dataForUpload, setDataForUpload] = React.useState([]);
  const [dataForUploadLenght, setDataForUploadLenght] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const pageChange = (pageInfo) => {
    setPaginationModel(pageInfo);
  };

  const [files, setFiles] = React.useState<FileList | []>([]);

  const checkIsReading = () => {
    axios.get(backEndUrl + "/csv/check/reading").then((res) => {
      console.log(res.data);
    });
  };

  const handleFileSelection = (event: React.FormEvent) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      setFiles(files);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i += 1) {
      formData.append("files", files[i]);
    }
    setStatus("Reading");
    axios
      .post(backEndUrl + "/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
        setLoading(true);
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
        setDataForUpload(analisys);
        setDataForUploadLenght(analisys.length);
        setStatus("Readed and uploaded");
        setLoading(false);
        toast.success("File uploaded", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: false,
          draggable: true,
        });
      })
      .catch((e) => {
        setStatus("ERROR");
        console.log(e);
      });
  };

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (status === "Reading")
        axios.get(backEndUrl + "/csv/check/reading").then((res) => {
          setStatus(res.data.status);
          if (res.data.uploadedData !== 0)
            setProgress((res.data.uploadedData / res.data.fileSize) * 4000);
          else setProgress(0);
        });
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div style={{ display: "block", justifyContent: "center", width: "100%" }}>
      <DataGrid
        sx={{
          marginBottom: 5,
          height: 550,
          width: "100%",
        }}
        rows={dataForUpload}
        paginationMode="server"
        rowCount={dataForUploadLenght}
        paginationModel={paginationModel}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.fileName}
        disableRowSelectionOnClick
        onPaginationModelChange={pageChange}
      />
      <Box sx={{ display: "inline" }}>
        <form
          style={{
            display: "flex",
            justifyContent: "center",
          }}>
          <Typography style={{ paddingRight: 50 }}>
            Status of uploading: {status}
          </Typography>
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
        <LinearProgressWithLabel sx={{ marginTop: 10 }} value={progress} />
      </Box>
    </div>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
