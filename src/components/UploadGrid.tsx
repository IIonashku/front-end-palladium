import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";
import axios from "axios";
import { backEndUrl } from "../config.ts";
import "react-toastify/dist/ReactToastify.css";

const columns: GridColDef[] = [
  { field: "badDataCounter", headerName: "Not Valid", width: 110 },
  {
    field: "duplicateInFile",
    headerName: "Duplicate In File",
    width: 170,
  },
  {
    field: "duplicateInMongo",
    headerName: "Duplicate In Mongo",
    width: 170,
  },
  {
    field: "validDataCounter",
    headerName: "Valid data",
    width: 110,
  },
  {
    field: "fileName",
    headerName: "Uploaded file",
    width: 310,
  },
];

const successfylToast = () => {
  toast.success("File uploaded", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    draggable: true,
  });
};

const errorToast = (e) => {
  toast.error(e, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    draggable: true,
  });
};

export default function Upload() {
  const [status, setStatus] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [dataForUpload, setDataForUpload] = React.useState([]);
  const [dataForUploadLenght, setDataForUploadLenght] = React.useState(0);
  const [update, setUpdate] = React.useState(false);
  const [start, setStart] = React.useState(true);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const pageChange = (pageInfo) => {
    setLoading(true);
    setPaginationModel(pageInfo);
    axios
      .post(
        backEndUrl + "/csv/analisys/data",
        {
          options: {
            skips: pageInfo.page * pageInfo.pageSize,
            limits: pageInfo.pageSize,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then((res) => {
        setDataForUpload(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post(
        backEndUrl + "/csv/analisys/count",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setDataForUploadLenght(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (start) {
    setStart(false);
    pageChange(paginationModel);
    axios.get(backEndUrl + "/csv/check/reading").then((res) => {
      console.log(res.data);
      setStatus(res.data.status);
      if (res.data.uploadedData !== 0 && res.data.lines !== 0)
        setProgress((res.data.uploadedData / res.data.lines) * 100);
      else setProgress(0);
    });
  }

  const [files, setFiles] = React.useState<FileList | []>([]);

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
    if (update)
      axios
        .post(backEndUrl + "/csv/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.access_token,
          },
        })
        .then((res) => {
          pageChange(paginationModel);
          setStatus("Readed and uploaded");
          setProgress(100);
          successfylToast();
        })
        .catch((e) => {
          console.log(e);
          setStatus("ERROR");
          errorToast(e);
          console.log(e);
        });
    else {
      axios
        .post(backEndUrl + "/csv/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.access_token,
          },
        })
        .then((res) => {
          pageChange(paginationModel);
          setStatus("Readed and uploaded");
          setProgress(100);
          successfylToast();
        })
        .catch((e) => {
          console.log(e);
          setStatus("ERROR");
          errorToast(e);
          console.log(e);
        });
    }
  };
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (status === "Reading")
        axios.get(backEndUrl + "/csv/check/reading").then((res) => {
          console.log(res.data);
          setStatus(res.data.status);
          if (res.data.uploadedData !== 0 && res.data.lines !== 0)
            setProgress((res.data.uploadedData / res.data.lines) * 100);
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
        <FormControlLabel
          sx={{ display: "flex", justifyContent: "center" }}
          control={
            <Checkbox value={update} onChange={(e) => setUpdate(!update)} />
          }
          label="Update"
        />

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
