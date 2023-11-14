import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { backEndUrl } from "../config.ts";

export default function UploadForm() {
  const [files, setFiles] = useState<FileList | []>([]);

  const handleFileSelection = (event: React.FormEvent) => {
    console.log(event);
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      console.log(setFiles(files));
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    //formData.append("files", files[0]);
    for (let i = 0; i < files.length; i += 1) {
      console.log(files[i]);
      formData.append("files", files[i]);
    }
    console.log(formData.values());
    axios
      .post(backEndUrl + "/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <form>
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
  );
}
