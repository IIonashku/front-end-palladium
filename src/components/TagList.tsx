import axios from "axios";
import React from "react";
import { backEndUrl } from "../config.ts";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const successfylToast = (message = "Deleted succesfully") => {
  toast.success(message, {
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

export default function TagList() {
  const [listTag, setListTag] = React.useState<any[]>([]);
  const [start, setStart] = React.useState(true);
  if (start) {
    setStart(!start);
    axios
      .post(
        backEndUrl + "/csv/analisys/tags",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then((res) => {
        setListTag(res.data);
      })
      .catch((e) => {
        errorToast(e);
        console.log(e);
      });
  }

  const hanldeDelete = (fileName: string) => {
    console.log(fileName);
    axios
      .delete(backEndUrl + `/csv/analisys/delete/${fileName}`, {
        headers: { Authorization: "Bearer " + localStorage.access_token },
      })
      .then((res) => {
        setStart(!start);
        console.log(res.data);
        successfylToast(
          `File ${fileName}, deleted successfylly and deled also ${res.data.deletedData} of csvs data`
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ display: "table-row", minWidth: "100%" }}>
      {listTag.map((tag) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "2px solid rgba(184, 0, 0, 0.3)",
              borderRadius: "4px",
              minWidth: "100%",
              background: "#ffc9ca",
              paddingLeft: 10,
              marginBottom: 5,
            }}>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                width: 500,
                marginRight: 10,
              }}>
              {tag.fileName}
            </div>
            <div
              style={{
                background: "#1273de",
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 40,
                minWidth: 70,
                borderRadius: "7px",
                color: "white",
              }}>
              {tag.validDataCounter}
            </div>
            <Button
              style={{
                display: "inline-block",
                paddingTop: 10,
              }}
              onClick={() => hanldeDelete(tag.fileName)}>
              <DeleteIcon />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
