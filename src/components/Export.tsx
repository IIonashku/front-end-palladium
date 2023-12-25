import { Stack, Button, Typography, Dialog } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import React from "react";
import axios from "axios";
import { backEndUrl } from "../config.ts";
import { errorToast, successfulToast } from "../functions/toast.message.ts";
import InfoIcon from "@mui/icons-material/Info";

export function Export() {
  const [exportFiles, setExportFiles] = React.useState<any>([]);
  const [start, setStart] = React.useState<boolean>(true);
  const [brokenCarrierLenght, setBrokenCarrierLenght] = React.useState(0);
  const [brokenLastnameLenght, setBrokenLastnameLenght] = React.useState(0);
  const [info, setInfo] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState({
    listTag: "",
    phoneNumber: "",
    carrier: "",
    fileName: "",
    numData: 0,
  });
  const getFiles = () => {
    axios
      .get(backEndUrl + "/csv/export/files", {
        headers: { Authorization: "Bearer " + localStorage.access_token },
      })
      .then((res) => {
        setExportFiles(res.data);
      });
  };

  const brokenDataLenght = () => {
    axios
      .get(backEndUrl + "/csv/fix/count", {
        headers: { Authorization: "Bearer " + localStorage.access_token },
      })
      .then((res) => {
        setBrokenCarrierLenght(res.data.brokenCarrier);
        setBrokenLastnameLenght(res.data.brokenLastname);
      });
  };

  if (start) {
    setStart(false);
    getFiles();
    brokenDataLenght();
  }
  const handleFixCarrier = () => {
    axios
      .get(backEndUrl + "/csv/fix/carrier", {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
        successfulToast(`Fixed ${res.data} data's carrier`);
      })
      .catch((err) => {
        console.log(err);
        errorToast("Something went wrong");
      });
  };

  const handleFixLastName = () => {
    axios
      .get(backEndUrl + "/csv/fix/lastname", {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
        successfulToast(`Fixed ${res.data} data's carrier`);
      })
      .catch((err) => {
        errorToast("Something went wrong");
        console.log(err);
      });
  };

  const handleDeleteFile = (fileName: string) => {
    axios
      .get(backEndUrl + `/csv/export/delete/${fileName}`, {
        headers: { Authorization: "Bearer " + localStorage.access_token },
      })
      .then((res) => {
        successfulToast(`File ${fileName}.csv was deleted`);
        getFiles();
      })
      .catch((err) => {
        console.log(err);
        errorToast("Something went wrong");
      });
  };

  const handleDownloadFile = (fileName: string) => {
    axios
      .get(backEndUrl + `/csv/download/${fileName}`, {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
        },
        responseType: "blob",
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
        errorToast("Something went wrong");
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
      </div>
    </div>
  );
}
