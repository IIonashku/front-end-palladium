import { createTheme } from "@mui/material";

export const defaultTheme = createTheme({
  palette: {
    primary: {
      light: "#0276aa",
      main: "#1565c0",
      dark: "#35baf6",
    },
    secondary: {
      light: "#ff4569",
      main: "#000000",
      dark: "#b2102f",
      contrastText: "#000",
    },
  },
});
