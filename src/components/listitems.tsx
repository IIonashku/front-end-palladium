import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import styles from "./components.module.css";

export const MainListItems = () => {
  return (
    <React.Fragment>
      <Link to="/user">
        <ListItemButton sx={{ display: "inline-flex" }}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ margin: 2, marginLeft: 0 }} />
          </ListItemIcon>
          <ListItemText primary="User" className={styles.Links} />
        </ListItemButton>
      </Link>
      <Link to="/data">
        <ListItemButton sx={{ display: "inline-flex" }}>
          <ListItemIcon>
            <BackupTableIcon sx={{ margin: 2, marginLeft: 0 }} />
          </ListItemIcon>
          <ListItemText primary="Data table" className={styles.Links} />
        </ListItemButton>
      </Link>
      <Link to="/upload">
        <ListItemButton sx={{ display: "inline-flex" }}>
          <ListItemIcon>
            <BackupTableIcon sx={{ margin: 2, marginLeft: 0 }} />
          </ListItemIcon>
          <ListItemText primary="Upload table" className={styles.Links} />
        </ListItemButton>
      </Link>
      <Link to="/tag/lists">
        <ListItemButton sx={{ display: "inline-flex" }}>
          <ListItemIcon>
            <FormatListBulletedIcon sx={{ margin: 2, marginLeft: 0 }} />
          </ListItemIcon>
          <ListItemText primary="List of tags" className={styles.Links} />
        </ListItemButton>
      </Link>
      <Link to="/export">
        <ListItemButton sx={{ display: "inline-flex" }}>
          <ListItemIcon>
            <FileUploadIcon sx={{ margin: 2, marginLeft: 0 }} />
          </ListItemIcon>
          <ListItemText primary="Exports" className={styles.Links} />
        </ListItemButton>
      </Link>
    </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  return (
    <React.Fragment>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon sx={{ margin: 2 }} />
        </ListItemIcon>
        <ListItemText primary="Current month" sx={{ pl: 2 }} />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon sx={{ margin: 2 }} />
        </ListItemIcon>
        <ListItemText primary="Last quarter" sx={{ pl: 2 }} />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon sx={{ margin: 2 }} />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" sx={{ pl: 2 }} />
      </ListItemButton>
    </React.Fragment>
  );
};
