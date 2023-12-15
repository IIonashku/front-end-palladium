import axios from "axios";
import React from "react";
import { backEndUrl } from "../config.ts";
import { Button, Checkbox, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { errorToast, successfulToast } from "../functions/toast.message.ts";

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
      });
  }

  const hanldeDelete = (fileName: string): void => {
    axios
      .delete(backEndUrl + `/csv/analisys/delete/${fileName}`, {
        headers: { Authorization: "Bearer " + localStorage.access_token },
      })
      .then((res) => {
        for (let i = 0; i < listTag.length; i++) {
          if (listTag[i].fileName === fileName) {
            listTag.splice(i, 1);
            const index = selected.indexOf(fileName);
            selected.splice(index, 1);
            console.log(listTag);
            console.log(selected);
            break;
          }
        }
        setStart(!start);
        console.log(res.data);
        successfulToast(
          `File ${fileName}, deleted successfully and deled also ${res.data.deletedData} of csvs data`
        );
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
    for (let i = 0; i < selected.length; i++) {
      hanldeDelete(selected[i]);
    }
  }

  return (
    <Stack
      flexWrap="wrap"
      direction="column"
      alignItems="stretch"
      spacing={0.4}
      style={{ width: "90%", margin: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "2px solid rgba(184, 0, 0, 0.3)",
          borderRadius: "4px",
          minHeight: 51.5,
          background: "#ffc9ca",
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
            ...(!(selected.length >= 1) && { display: "none" }),
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
        return (
          <div
            key={tag.fileName}
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              border: "2px solid rgba(184, 0, 0, 0.3)",
              borderRadius: "4px",
              width: "100%",
              minWidth: "100%",
              maxWidth: "130%",
              boxSizing: "border-box",
              background: "#ffc9ca",
              paddingLeft: 10,
              minHeight: 51.5,
            }}>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                width: "50%",
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
    </Stack>
  );
}
