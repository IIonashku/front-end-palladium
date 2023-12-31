import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./components.module.css";

export const MainListItems = () => {
  return (
    <React.Fragment>
      <Link to="/user">
        <ListItemButton sx={{ display: "inline-flex" }}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ margin: 2 }} />
          </ListItemIcon>
          <ListItemText primary="User" className={styles.Links} />
        </ListItemButton>
      </Link>
      <Link to="/">
        <ListItemButton sx={{ display: "inline-flex" }}>
          <ListItemIcon>
            <BackupTableIcon sx={{ margin: 2 }} />
          </ListItemIcon>
          <ListItemText primary="Table" className={styles.Links} />
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
