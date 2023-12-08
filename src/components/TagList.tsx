import axios from "axios";
import React from "react";
import { backEndUrl } from "../config.ts";
import { Button, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { errorToast, successfylToast } from "../functions/toast.message.ts";
import { notificationStrings } from "./mainPage.tsx";

export default function TagList() {
  const [listTag, setListTag] = React.useState<any[]>([]);
  const [start, setStart] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);
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
        notificationStrings.unshift({
          type: "error",
          message: "Error occured",
        });
      });
  }

  const hanldeDelete = (fileName: string): void => {
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
        notificationStrings.unshift({
          type: "successfyl",
          message: "Error occured",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSelect = (fileName: string): void => {
    if (selected.includes(fileName)) {
      const index = selected.indexOf(fileName);
      selected.splice(index, 1);
      setSelected((prevSelect) => [...prevSelect]);
    } else {
      setSelected((prevSelect) => [...prevSelect, fileName]);
    }
  };
  const handleSelectAll = (): void => {
    if (selected.length === listTag.length) {
      setSelected((prevSelect) => []);
    } else {
      const hadleStartSelect: any[] = [];
      listTag.forEach((tag: any) => {
        hadleStartSelect.push(tag.fileName);
      });
      setSelected(hadleStartSelect);
    }
  };

  function hanldeDeleteAllSelected(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div style={{ display: "table-row", minWidth: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "2px solid rgba(184, 0, 0, 0.3)",
          borderRadius: "4px",
          minWidth: "100%",
          minHeight: 51.5,
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
          Name of the file
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
          Number
        </div>
        <Button
          style={{
            display: "inline-block",
            paddingTop: 10,
            ...(!(selected.length === listTag.length) && { display: "none" }),
          }}
          onClick={() => hanldeDeleteAllSelected()}>
          <DeleteIcon />
        </Button>
        <Checkbox
          value={selected.length === listTag.length}
          checked={selected.length === listTag.length}
          onChange={() => {
            handleSelectAll();
          }}></Checkbox>
      </div>
      {listTag.map((tag) => {
        tag.localSelect = true;
        return (
          <div
            key={tag.fileName}
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
              minHeight: 51.5,
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
                ...(!selected.includes(tag.fileName) && {}),
              }}>
              {tag.validDataCounter}
            </div>
            <Button
              style={{
                display: "inline-block",
                paddingTop: 10,
                ...(!selected.includes(tag.fileName) && { display: "none" }),
              }}
              onClick={() => hanldeDelete(tag.fileName)}>
              <DeleteIcon />
            </Button>
            <Checkbox
              value={tag.fileName}
              checked={selected.includes(tag.fileName)}
              onChange={() => {
                handleSelect(tag.fileName);
              }}></Checkbox>
          </div>
        );
      })}
    </div>
  );
}
