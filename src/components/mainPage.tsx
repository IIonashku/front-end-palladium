import * as React from "react";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { defaultTheme } from "../themes/theme.ts";
import { Copyright } from "@mui/icons-material";
import { MainListItems } from "./listitems.tsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Backdrop, Button } from "@mui/material";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Main({ Element }) {
  const [open, setOpen] = React.useState(true);
  const [openNotification, setOpenNotification] = React.useState(false);
  const [notification, setNotification] = React.useState([]);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenNotification = (notificationBool: boolean) => {
    setOpenNotification(notificationBool);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}>
              <MenuIcon
                sx={{ marginRight: 3.6, ...(open && { display: "none" }) }}
              />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}>
              Csv
            </Typography>
            <IconButton color="secondary">
              <Badge
                badgeContent={notification.length}
                style={{ color: "white" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleOpenNotification(!openNotification);
                  }}>
                  <NotificationsIcon />
                </Button>
              </Badge>
            </IconButton>
            <Backdrop
              open={openNotification}
              sx={{
                width: "20%",
                height: "40%",
                left: "77.5%",
                top: "5.5%",
                background: "#fffff1",
                border: "2px solid #1565c0",
                borderRadius: "6px",
              }}></Backdrop>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <MainListItems />
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}>
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{
              mt: 4,
              mb: 4,
              ml: 0,
              mr: 0,
              display: "flex",
              justifyItems: "baseline",
            }}>
            <Element></Element>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
