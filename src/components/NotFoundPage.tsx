import { Button } from "@mui/material";
import React from "react";
import { axiosInstance } from "../axios.instance.ts";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    axiosInstance.get("/auth/check").then((res) => {
      if (res.data === true) {
        navigate("/data");
      } else navigate("/");
    });
  };
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}>
      <h2>Ooppsss...</h2>
      <h1>Page Not Found</h1>
      <Button variant="contained" onClick={handleRedirect}>
        Redirect to main
      </Button>
    </div>
  );
}
