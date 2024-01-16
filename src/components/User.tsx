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
import { successfulToast } from "../functions/toast.message.ts";
import { axiosInstance } from "../axios.instance.ts";

export function User() {
  const roles = ["ADMIN", "USER"];
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserRole, setCreateUserRole] = useState("USER");
  const [createUserUsername, setCreateUserUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [userOldPassword, setUserOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState(["", ""]);
  const [user, setUser] = useState({
    username: localStorage.username,
    role: localStorage.role,
  });
  const getUser = () => {
    axiosInstance.get("/user/me").then((res) => {
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
    axiosInstance
      .post("/auth/create", {
        username: createUserUsername,
        password: createUserPassword,
        role: createUserRole,
      })
      .then((res) => {
        if (res == null) {
          return;
        }
        successfulToast(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangePassword = () => {
    if (newPassword[0].length >= 6 && newPassword[0] !== userOldPassword) {
      axiosInstance
        .post("/user/change/password", {
          newPassword: newPassword,
          oldPassword: userOldPassword,
        })
        .then((res) => {
          successfulToast("Password changed successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChangeUsername = () => {
    if (user.username !== newUsername) {
      axiosInstance
        .post("/user/change/username", {
          newUsername: newUsername,
          password: userOldPassword,
        })
        .then((res) => {
          successfulToast("Username changed successfully");
          getUser();
        })
        .catch((error) => {
          console.log(error);
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
          marginTop: "1%",
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
            sx={{
              ...(localStorage.role !== "ADMIN" && { display: "none" }),
              margiTop: 3,
              marginBottom: 3,
            }}>
            Create New User
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenUpdate}
            sx={{ margiTop: 3, marginBottom: 3 }}>
            Change username
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenChangePassword}
            sx={{ margiTop: 3, marginBottom: 3 }}>
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
            error={user.username === newUsername}
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
            id="oldPassword"
            label="Old password"
            type="password"
            fullWidth
            onChange={(event) => {
              setUserOldPassword(event.target.value);
            }}
          />
          <TextField
            error={
              newPassword[0] !== newPassword[1] && newPassword[0].length <= 6
            }
            margin="dense"
            id="newPassword"
            label="New password"
            type="password"
            fullWidth
            onChange={(event) => {
              setNewPassword([event.target.value, newPassword[1]]);
            }}
          />
          <TextField
            error={
              newPassword[0] !== newPassword[1] && newPassword[1].length <= 6
            }
            margin="dense"
            id="confirPassword"
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
