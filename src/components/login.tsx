import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { defaultTheme } from "../themes/theme.ts";
import { backEndUrl } from "../config.ts";
import { errorToast } from "../functions/toast.message.ts";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios.instance.ts";

type User = {
  user: {
    _id: string;
    username: string;
    role: string;
  };
  jwt: string;
  refresh: string;
};

type PostLoginResponse = {
  data: User;
};
export default function Login() {
  const [username, setUserName] = React.useState<string | null>();
  const [password, setPassword] = React.useState<string | null>();

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios
      .post<PostLoginResponse>(`${backEndUrl}/auth/login`, {
        username: username,
        password: password,
      })
      .then((res: any) => {
        localStorage.role = res.data.user.role;
        localStorage.username = res.data.user.username;
        localStorage.access_token = res.data.access_token;
        localStorage.refresh_token = res.data.refresh_token;
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.access_token}`;
        navigate("/data");
        return res.data;
      })
      .catch((error) => {
        console.log(error.response.data.message);
        errorToast(error.response.data.message);
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <LockOutlinedIcon color="primary" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              onChange={(event) => setUserName(event.target.value)}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: "black" }}>
                Sign In
              </Button>
            </Link>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
