import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import WalkingMan from "./components/WalkingMan";
import { getUser } from "./common/getUser";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axios
      .post("/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((res) => {
        localStorage.setItem("jwt", res.data.token);
        const user = getUser();
        if (user !== null) {
          navigate(`/sys`);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 400) {
          enqueueSnackbar("Invalid username or password", { variant: "error" });
        } else {
          enqueueSnackbar("Failed to login", { variant: "error" });
        }
        console.error(e);
      });
  };

  useEffect(() => {
    const user = getUser();
    if (user !== null) {
      navigate(`/sys`);
    }
  }, []);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundColor: "#1B508B",
          alignContent: "center",
        }}
      >
        <WalkingMan />
        <Typography
          align="center"
          variant="h2"
          color="#ffff"
          fontWeight="bold"
          fontFamily="cursive"
        >
          VisionGuide
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="assets/logo.png"
            height={"60px"}
            style={{ marginTop: "24px", marginBlock: "24px" }}
          />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
