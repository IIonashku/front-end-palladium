import axios from "axios";
//import React from "react";
import { backEndUrl } from "../config.ts";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  makeStyles,
} from "@mui/material";
import { defaultTheme } from "../themes/theme.ts";
import { errorToast, successfulToast } from "../functions/toast.message.ts";

export function User() {
  const [open, setOpen] = useState(false);
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserRole, setCreateUserRole] = useState("");
  const [createUserUsername, setCreateUserUsername] = useState("");
  const [user, setUser] = useState({ username: "", role: "" });
  const [start, setStart] = useState(true);
  const getUser = () => {
    axios
      .get(backEndUrl + "/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      });
  };
  if (start) {
    setStart(false);
    getUser();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateUser = () => {
    axios
      .post(
        backEndUrl + "/auth/create",
        {
          username: createUserUsername,
          password: createUserPassword,
          role: createUserRole,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        successfulToast(res.data);
      })
      .catch((err) => {
        console.log(err);
        errorToast(err.message);
      });
  };

  return (
    <div>
      <div>
        <h1>Username: {user.username}</h1>
        <p>Role: {user.role}</p>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          sx={{ ...(user.role !== "ADMIN" && { display: "none" }) }}>
          Create New User
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            onChange={(event) => {
              setCreateUserUsername(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="role"
            label="Role"
            type="text"
            fullWidth
            onChange={(event) => {
              setCreateUserRole(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            onChange={(event) => {
              setCreateUserPassword(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateUser} color="primary">
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
