import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { backEndUrl } from "../config.ts";
import { Box } from "@mui/material";

export let dataForUpload: any = [];
export let dataForUploadLenght = 0;

export default function UploadForm() {
  const [files, setFiles] = useState<FileList | []>([]);

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
    axios
      .post(backEndUrl + "/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
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
        dataForUpload = analisys;
        dataForUploadLenght = analisys.length;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Box sx={{ display: "inline" }}>
      <Box></Box>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
        }}>
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
    </Box>
  );
}
