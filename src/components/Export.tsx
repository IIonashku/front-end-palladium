import {
  Stack,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import React from "react";
import { successfulToast } from "../functions/toast.message.ts";
import InfoIcon from "@mui/icons-material/Info";
import { axiosInstance } from "../axios.instance.ts";

export function Export() {
  const [exportFiles, setExportFiles] = React.useState<any>([]);
  const [start, setStart] = React.useState<boolean>(true);
  const [brokenCarrierLenght, setBrokenCarrierLenght] = React.useState(0);
  const [brokenLastnameLenght, setBrokenLastnameLenght] = React.useState(0);
  const [DBValidData, setDBValidData] = React.useState(0);
  const [DBNullTypeAndCarrierCount, setDBNullTypeAndCarrier] =
    React.useState(0);
  const [info, setInfo] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [action, setAction] = React.useState("");
  const [fileInfo, setFileInfo] = React.useState({
    listTag: "",
    phoneNumber: "",
    carrier: "",
    fileName: "",
    numData: 0,
  });
  const getFiles = () => {
    axiosInstance.get("/csv/export/files").then((res) => {
      if (res == null) {
        return;
      }
      setExportFiles(res.data);
    });
  };

  const DBInfo = () => {
    axiosInstance.get("/csv/fix/count").then((res) => {
      if (res == null) {
        return;
      }
      setBrokenCarrierLenght(res.data.brokenCarrier);
      setBrokenLastnameLenght(res.data.brokenLastname);
    });
    axiosInstance.get("/csv/analis/get/DBInfo").then((res) => {
      if (res == null) {
        return;
      }
      setDBNullTypeAndCarrier(res.data.nullTypeAndCarrier);
      setDBValidData(res.data.validDataCounter);
    });
  };

  const handleConfirmUpdate = () => {
    if (action === "DBInfo") {
      axiosInstance.get("/csv/analisys/all/set/").then((res) => {
        successfulToast("Updating data complited");
      });
    } else if (action === "listTag") {
      axiosInstance.get("/csv/analisys/tags/set/").then((res) => {
        successfulToast("Updating data tags complited");
      });
    }
    handleClose();
  };

  if (start) {
    setStart(false);
    getFiles();
    DBInfo();
  }
  const handleFixCarrier = () => {
    axiosInstance.get("/csv/fix/carrier").then((res) => {
      if (res == null) {
        return;
      }
      successfulToast(`Fixed ${res.data} data's carrier`);
    });
  };

  const handleFixLastName = () => {
    axiosInstance.get("/csv/fix/lastname").then((res) => {
      if (res == null) {
        return;
      }
      successfulToast(`Fixed ${res.data} data's carrier`);
    });
  };

  const handleDeleteFile = (fileName: string) => {
    axiosInstance.get(`/csv/export/delete/${fileName}`).then((res) => {
      if (res == null) {
        return;
      }
      successfulToast(`File ${fileName}.csv was deleted`);
      getFiles();
    });
  };

  const handleDownloadFile = (fileName: string) => {
    axiosInstance
      .get(`/csv/download/${fileName}`, {
        responseType: "blob",
      })
      .then((res) => {
        if (res == null) {
          return;
        }
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
  };

  const deleteAll = () => {
    exportFiles.forEach((file) => {
      handleDeleteFile(file.fileName);
    });
    getFiles();
  };
  const downloadAll = () => {
    exportFiles.forEach((file) => {
      handleDownloadFile(file.fileName);
    });
  };

  const openFileInfo = (file: any) => {
    setFileInfo({
      listTag: file.listTag,
      phoneNumber: file.phoneNumber,
      carrier: file.carrier,
      fileName: file.fileName,
      numData: file.dataCounter,
    });
    setInfo(true);
  };

  const handleClose = (): void => {
    setOpenConfirm(false);
  };

  const openConfirmDialog = (action: string) => {
    setAction(action);
    setOpenConfirm(true);
  };

  return (
    <div style={{ display: "flex" }}>
      <Stack
        flexWrap="wrap"
        direction="column"
        alignItems="stretch"
        spacing={0.4}
        style={{ width: "60%", margin: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "2px solid rgba(0, 77, 207, 0.3)",
            borderRadius: "4px",
            minHeight: 51.5,
            background: "#1273de",
            paddingLeft: 10,
          }}>
          <div
            style={{
              width: "50%",
            }}>
            Name of the file
          </div>
          <div
            style={{
              background: "#900000",
              display: "grid",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 40,
              minWidth: 70,
              borderRadius: "7px",
              color: "white",
            }}>
            Number
          </div>
          <div>
            <Button
              style={{
                display: "inline-block",
                paddingTop: 10,
                ...(!(exportFiles.length >= 1) && { display: "none" }),
              }}
              onClick={() => {
                deleteAll();
              }}>
              <DeleteIcon style={{ color: "crimson" }} />
            </Button>
            <Button
              style={{
                display: "inline-block",
                paddingTop: 10,
              }}
              onClick={() => {}}
              disabled>
              <InfoIcon style={{ color: "white" }} />
            </Button>
            <Button
              style={{
                display: "inline-block",
                paddingTop: 10,
              }}
              disabled={exportFiles.length === 0}
              onClick={() => {
                downloadAll();
              }}>
              <FileDownloadIcon style={{ color: "white" }} />
            </Button>
          </div>
        </div>
        {exportFiles.map((file) => {
          return (
            <div
              key={file.fileName}
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                border: "2px solid rgba(0, 77, 207, 0.3)",
                borderRadius: "4px",
                width: "100%",
                boxSizing: "border-box",
                background: "#1273de",
                paddingLeft: 10,
                minHeight: 51.5,
              }}>
              <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  width: "50%",
                }}>
                {file.fileName}
              </div>
              <div
                style={{
                  background: "#900000",
                  display: "grid",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 40,
                  minWidth: 70,
                  borderRadius: "7px",
                  color: "white",
                }}>
                {file.dataCounter}
              </div>
              <div>
                <Button
                  style={{
                    display: "inline-block",
                    paddingTop: 10,
                  }}
                  onClick={() => {
                    handleDeleteFile(file.fileName);
                  }}>
                  <DeleteIcon style={{ color: "crimson" }} />
                </Button>
                <Button
                  style={{
                    display: "inline-block",
                    paddingTop: 10,
                  }}
                  onClick={() => {
                    openFileInfo(file);
                  }}>
                  <InfoIcon style={{ color: "white" }}></InfoIcon>
                </Button>
                <Button
                  style={{
                    display: "inline-block",
                    paddingTop: 10,
                  }}
                  onClick={() => {
                    handleDownloadFile(file.fileName);
                  }}>
                  <FileDownloadIcon style={{ color: "white" }} />
                </Button>
              </div>
            </div>
          );
        })}
      </Stack>
      <Dialog open={info}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
          }}>
          <div style={{ margin: 30 }}>
            <Typography>fileName: {fileInfo.fileName}.csv</Typography>
            <Typography>Data count {fileInfo.numData}</Typography>
            <Typography>
              List tag filter: {fileInfo.listTag ? fileInfo.listTag : "None"}
            </Typography>
            <Typography>
              Phone number filter:{" "}
              {fileInfo.phoneNumber ? fileInfo.phoneNumber : "None"}
            </Typography>
            <Typography>
              Carrier filter: {fileInfo.carrier ? fileInfo.carrier : "None"}
            </Typography>
          </div>
          <Button onClick={() => setInfo(false)} style={{ margin: 10 }}>
            Close
          </Button>
        </div>
      </Dialog>
      <div
        style={{
          margin: "1.5%",
          border: "2px solid #1273de",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          alignContent: "stretch",
          width: "35%",
        }}>
        <Typography sx={{ margin: "1%" }}>
          Broken lastnames in data: {brokenLastnameLenght}
        </Typography>
        <Typography sx={{ margin: "1%" }}>
          Broken Carrier in data: {brokenCarrierLenght}
        </Typography>
        <Typography sx={{ margin: "1%" }}>
          Null type and carrier: {DBNullTypeAndCarrierCount}
        </Typography>{" "}
        <Typography sx={{ margin: "1%" }}>Valid data: {DBValidData}</Typography>
        <Button
          variant="contained"
          style={{ margin: "1.5%" }}
          onClick={() => {
            handleFixLastName();
          }}>
          Fix lastName
        </Button>
        <Button
          variant="contained"
          style={{ margin: "1.5%" }}
          onClick={() => {
            handleFixCarrier();
          }}>
          Fix carrier
        </Button>
        <Button
          variant="contained"
          style={{ margin: "1.5%", color: "red" }}
          onClick={() => {
            openConfirmDialog("DBInfo");
          }}>
          Start all DB analisys
        </Button>
        <Button
          variant="contained"
          style={{ margin: "1.5%", color: "red" }}
          onClick={() => {
            openConfirmDialog("listTag");
          }}>
          Start all list tag analisys
        </Button>
        <Dialog
          open={openConfirm}
          onClose={handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
            Confirm updating analisys data
          </DialogTitle>
          <Typography
            style={{ margin: "20px", textAlign: "center", color: "red" }}>
            WARNING, once it started, it can cause lagging of all query during
            processing of data
          </Typography>
          <DialogActions
            style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmUpdate} color="primary">
              Confirm update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
