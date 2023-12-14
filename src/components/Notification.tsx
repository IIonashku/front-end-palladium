import React from "react";
import { notificationMessage, notificationStrings } from "./mainPage.tsx";
import { Box, Button, CircularProgress, Container, Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export function Notifications() {
  const [loading, setLoading] = React.useState(false);
  const handleClear = (message: notificationMessage) => {
    setLoading(true);
    const index = notificationStrings.indexOf(message);
    notificationStrings.splice(index, 1);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  const handleClearAll = () => {
    setLoading(true);
    notificationStrings.splice(0, notificationStrings.length);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  return (
    <Box
      sx={{
        ...(!loading && {
          justifyContent: "flex-start",
        }),
        ...(notificationStrings.length === 0 &&
          !loading && {
            position: "absolute",
            left: "28%",
            top: "45%",
            width: "50%",
            height: "10%",
          }),
        ...(notificationStrings.length !== 0 &&
          loading && {
            width: "100%",
            height: "100%",
          }),
        overflow: "hidden",
      }}>
      <Stack
        direction="column"
        alignItems="stretch"
        spacing={0}
        style={{
          color: "black",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        sx={{ ...(loading && { display: "none" }) }}>
        <Container
          style={{
            width: "100%",
            alignItems: "center",
            display: "flex",
          }}>
          <h4
            style={{ margin: 0, padding: 3, justifyContent: "space-between" }}>
            Notifications
          </h4>
          <Button
            sx={{
              alignItems: "center",
              justifyContent: "center",
              top: 0,
              right: 0,
              padding: 0,
            }}
            style={{ width: 30 }}
            onClick={() => handleClearAll()}>
            <ClearIcon sx={{ fontSize: 20 }}></ClearIcon>
          </Button>
        </Container>
        {notificationStrings.map((notification) => {
          return (
            <Container
              sx={{
                width: "100%",
                alignItems: "center",
                display: "flex",
                padding: 0,
                ...(notification.type === "error" && {
                  background: "#ff6865",
                }),
                ...(notification.type === "successful" && {
                  background: "#add8e6",
                }),
              }}>
              <p
                style={{
                  display: "inline-block",
                  marginBottom: 3,
                  marginTop: 3,
                  fontSize: 16,
                  width: "100%",
                  position: "relative",
                }}>
                {notification.message + "\n"}
              </p>
              <Button
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  top: 0,
                  right: 0,
                  padding: 0,
                }}
                style={{ width: 30 }}
                onClick={() => handleClear(notification)}>
                <ClearIcon sx={{ fontSize: 15 }}></ClearIcon>
              </Button>
            </Container>
          );
        })}
      </Stack>
      <CircularProgress
        sx={{
          ...(!loading && { display: "none", left: "50%" }),
          position: "absolute",
          left: "45%",
          top: "45%",
        }}
      />
    </Box>
  );
}
