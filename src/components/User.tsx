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
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { errorToast, successfulToast } from "../functions/toast.message.ts";

export function User() {
  const roles = ["ADMIN", "USER"];
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserRole, setCreateUserRole] = useState("");
  const [createUserUsername, setCreateUserUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [userOldPassword, setUserOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState(["", ""]);
  const [user, setUser] = useState({
    username: localStorage.username,
    role: localStorage.role,
  });
  const getUser = () => {
    axios
      .get(backEndUrl + "/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
        setUser(res.data);
      });
  };
  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleClickOpenUpdate = () => {
    setOpenUpdate(true);
  };

  const handleClickOpenChangePassword = () => {
    setOpenChangePassword(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenChangePassword(false);
    setUserOldPassword("");
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
        successfulToast(res.data);
      })
      .catch((err) => {
        console.log(err);
        errorToast(err.message);
      });
  };

  const handleChangePassword = () => {
    if (newPassword[0].length >= 6 && newPassword[0] !== userOldPassword) {
      axios
        .post(
          backEndUrl + "/user/change/password",
          {
            newPassword: newPassword,
            oldPassword: userOldPassword,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.access_token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          successfulToast("Password changed successfully");
        })
        .catch((e) => {
          errorToast(e.message);
        });
    }
  };

  const handleChangeUsername = () => {
    if (user.username !== newUsername) {
      axios
        .post(
          backEndUrl + "/user/change/username",
          {
            newUsername: newUsername,
            password: userOldPassword,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.access_token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          successfulToast("Username changed successfully");
          getUser();
        })
        .catch((e) => {
          errorToast(e.message);
        });
    }
  };

  function handleChooseRole(event: SelectChangeEvent<string>): void {
    setCreateUserRole(event.target.value);
  }

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignContent: "center",
          justifyContent: "space-evenly",
        }}>
        <div>
          <h1>Username: {user.username}</h1>
          <p>Role: {user.role}</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
            flexWrap: "wrap",
          }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenCreate}
            sx={{ ...(localStorage.role !== "ADMIN" && { display: "none" }) }}>
            Create New User
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenUpdate}>
            Change username
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenChangePassword}>
            Change password
          </Button>
        </div>
      </div>

      <Dialog
        open={openCreate}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
          Create New User
        </DialogTitle>
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
            id="password"
            label="Password"
            type="password"
            fullWidth
            onChange={(event) => {
              setCreateUserPassword(event.target.value);
            }}
          />
          <FormControl fullWidth sx={{ marginTop: 1 }}>
            <InputLabel id="role-box-label">Role</InputLabel>
            <Select
              labelId="role-box-label"
              defaultValue="USER"
              input={<OutlinedInput label="Role" />}
              onChange={handleChooseRole}>
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  <ListItemText primary={role} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

      <Dialog
        open={openUpdate}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
          Update username
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="New username"
            type="text"
            fullWidth
            onChange={(event) => {
              setNewUsername(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            onChange={(event) => {
              setUserOldPassword(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleChangeUsername} color="primary">
            Change username
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openChangePassword}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
          Change password
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="password"
            label="Old password"
            type="password"
            fullWidth
            onChange={(event) => {
              setUserOldPassword(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="password"
            label="New password"
            type="password"
            fullWidth
            onChange={(event) => {
              setNewPassword([event.target.value, newPassword[1]]);
            }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Confirm Password"
            type="password"
            fullWidth
            onChange={(event) => {
              setNewPassword([newPassword[0], event.target.value]);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Change password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
