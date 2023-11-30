import axios from "axios";
import React from "react";
import { backEndUrl } from "../config.ts";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ display: "table-row" }}>
      {listTag.map((tag) => {
        return (
          <div
            style={{
              display: "inline-block",
              border: "2px solid rgba(184, 0, 0, 0.3)",
              borderRadius: "4px",
              width: "100%",
              background: "rgba(235, 150, 148, 5)",
              paddingLeft: 10,
              marginBottom: 5,
            }}>
            <li
              key={tag.fileName}
              style={{
                fontWeight: 600,
                width: 500,
                display: "inline-block",
              }}>
              {tag.fileName}: {tag.validDataCounter}
            </li>
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
