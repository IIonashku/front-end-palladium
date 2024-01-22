import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { errorToast, successfulToast } from "../functions/toast.message.ts";
import { axiosInstance } from "../axios.instance.ts";
import { backEndUrl } from "../config.ts";
import LinearProgressWithLabel from "./LinearProgressWithLabel.tsx";
import { toast } from "react-toastify";
import { uploadFileResult } from "../types.ts";

const columns: GridColDef[] = [
  { field: "badDataCounter", headerName: "Not Valid", width: 110 },
  {
    field: "duplicateInFile",
    headerName: "Duplicate in file",
    width: 170,
  },
  {
    field: "duplicateInMongo",
    headerName: "Duplicate in mongo",
    width: 170,
  },
  {
    field: "duplicateInBase",
    headerName: "Duplicate in base",
    width: 170,
  },
  {
    field: "nullTypeAndCarrier",
    headerName: "MLR missing",
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

export default function Upload() {
  const [status, setStatus] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [dataForUpload, setDataForUpload] = React.useState([]);
  const [dataForUploadLenght, setDataForUploadLenght] = React.useState(0);
  const [fileUploading, setFileUploading] = React.useState(0);
  const [update, setUpdate] = React.useState(false);
  const [start, setStart] = React.useState(true);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const pageChange = (pageInfo) => {
    setLoading(true);
    setPaginationModel(pageInfo);
    axiosInstance
      .post("/csv/analisys/data", {
        options: {
          skips: pageInfo.page * pageInfo.pageSize,
          limits: pageInfo.pageSize,
        },
      })
      .then((res) => {
        if (res == null) {
          return;
        }
        setDataForUpload(res.data);
      });

    axiosInstance.post("/csv/analisys/count", {}).then((res) => {
      setLoading(false);
      setDataForUploadLenght(res.data);
    });
  };

  if (start) {
    setStart(false);
    pageChange(paginationModel);
    axiosInstance.get(backEndUrl + "/csv/info/reading").then((res) => {
      if (res == null) {
        return;
      }
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
      axiosInstance
        .post("/csv/upload/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res == null) {
            return;
          }
          for (let i = 0; i < res.data.result.length; i++) {
            if (res.data.result[i].error) {
              errorToast(
                "Duplicate in on of the files" +
                  `\n file ${res.data.result[i].message} is exist`
              );
            }
          }
          pageChange(paginationModel);
          setStatus("Readed and uploaded");
          setProgress(100);
          successfulToast("All file has been readed");
        })
        .catch((e) => {
          setStatus("ERROR");
        });
    else {
      axiosInstance
        .post("/csv/upload/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res == null) {
            return;
          }
          const files: string[] = [];
          for (let i = 0; i < res.data.result.length; i++) {
            files.push(res.data.result[i].filename);
            if (res.data.result[i].error) {
              errorToast(
                "Duplicate in on of the files" +
                  `\n file ${res.data.result[i].message} is exist`
              );
            }
          }
          setFilenamesDetail(files);
          pageChange(paginationModel);
          setStatus("Readed and uploaded");
          setProgress(100);
          successfulToast("All file has been readed");

          toast.success("Read detail", {
            onClick: handleOpenDetail,
          });
          setDetails(res.data.result);
        })
        .catch((e) => {
          setStatus("ERROR");
        });
    }
  };

  const handleOpenDetail = (): void => {
    setOpenDetail(true);
  };
  const [openDetail, setOpenDetail] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (status !== "Uploaded" || fileUploading !== 0)
        axiosInstance.get(backEndUrl + "/csv/info/reading").then((res: any) => {
          setFileUploading(res.numOfFile);
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

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setAnchorEl(null);
    setSelectedIndex(0);
  };

  const handleCloseDetailMenu = () => {
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [filenamesDetail, setFilenamesDetail] = React.useState(["DBInfo"]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const openDetailInfo = Boolean(anchorEl);
  const [details, setDetails] = React.useState<uploadFileResult[]>([]);

  function handleClickListItem(event: React.MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuItemClick(
    event: React.MouseEvent<HTMLElement>,
    index: number
  ): void {
    setSelectedIndex(index);
    setAnchorEl(null);
  }

  return (
    <div
      style={{
        display: "block",
        justifyContent: "center",
        width: "96%",
        margin: "2%",
      }}>
      <Dialog open={openDetail} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
          Upload file detail
        </DialogTitle>
        <DialogContent>
          <ListItemButton
            id="File selector"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="Uploaded file"
            aria-expanded={openDetailInfo ? "true" : undefined}
            onClick={handleClickListItem}>
            <ListItemText
              primary="Choosed file"
              secondary={filenamesDetail[selectedIndex]}
            />
          </ListItemButton>
          <Typography
            sx={{
              ...(details[selectedIndex]?.error === undefined && {
                display: "none",
              }),
            }}>
            {details[selectedIndex]?.error?.message + "\n"}
          </Typography>
          <Typography
            sx={{
              ...(details[selectedIndex]?.file === undefined && {
                display: "none",
              }),
            }}>
            Filename: {details[selectedIndex]?.filename + "  "}
            Duplicate In File:{" "}
            {details[selectedIndex]?.file?.duplicateInFile + "  "}
            Duplicate In Mongo:{" "}
            {details[selectedIndex]?.file?.duplicateInMongo + "  "}
            Duplicate In Base:{" "}
            {details[selectedIndex]?.file?.duplicateInBase + "  "}
            Dad Data: {details[selectedIndex]?.file?.badDataCounter + "  "}
            Valid Data: {details[selectedIndex]?.file?.validDataCounter + "  "}
            HLR missing:{" "}
            {details[selectedIndex]?.file?.nullTypeAndCarrier + "  "}
            ATT Carrier: {details[selectedIndex]?.file?.ATTCarrier + "  "}
            T-Mobile Carrier:{" "}
            {details[selectedIndex]?.file?.TMobileCarrier + "  "}
            Verizon Carrier:{" "}
            {details[selectedIndex]?.file?.verizonCarrier + "\n"}
          </Typography>
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={openDetailInfo}
            onClose={handleCloseDetailMenu}
            MenuListProps={{
              "aria-labelledby": "lock-button",
              role: "listbox",
            }}>
            {filenamesDetail.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </DialogContent>
        <Button onClick={handleCloseDetail} color="primary">
          Close
        </Button>
      </Dialog>
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
