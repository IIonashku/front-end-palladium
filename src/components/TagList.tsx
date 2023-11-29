import axios from "axios";
import React from "react";
import { backEndUrl } from "../config.ts";
import { toast } from "react-toastify";

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
        console.log(e);
      });
  }
  return (
    <>
      {listTag.map((tag) => {
        return (
          <div
            style={{
              border: "2px solid rgba(184, 0, 0, 0.3)",
              borderRadius: "4px",
              width: "100%",
              background: "rgba(235, 150, 148, 5)",
              paddingLeft: 10,
            }}>
            <li
              key={tag.fileName}
              style={{
                fontWeight: 600,
                height: 50,
                width: 1000,
                display: "table-cell",
                verticalAlign: "middle",
              }}>
              {tag.fileName}: {tag.validDataCounter}
            </li>
          </div>
        );
      })}
    </>
  );
}
