import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
// import ForgotPassword from './ForgotPassword';
// import { SitemarkIcon } from './CustomIcons';
// import AppTheme from '../shared-theme/AppTheme';
// import ColorModeSelect from '../shared-theme/ColorModeSelect';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import personal_name from "../public/personal_name.png";

import { setEmpInfo } from "../common/Global";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props) {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [passwd, setPasswd] = useState("");

  const [isErrUserId, setIsErrUserId] = useState(false);
  const [isErrPasswd, setIsErrPasswd] = useState(false);

  const login = () => {
    if (userId === "") {
      setIsErrUserId(true);
    } else {
      setIsErrUserId(false);
    }
    if (passwd === "") {
      setIsErrPasswd(true);
    } else {
      setIsErrPasswd(false);
    }
    if (userId === "" || passwd === "") {
      if (userId === "") alert("ユーザーIDを入力してください");
      if (passwd === "") alert("パスワードを入力してください");
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          pass: passwd,
        }),
      };

      /** パスワード変更 */
      // fetch(
      //   process.env.REACT_APP_BACKEND_URL + "/updatePassword",
      //   requestOptions
      // )
      //   .then((res) => res.json())
      //   .then((json) => {
      //     alert("パスワードを変更しました");
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching data:", error);
      //   });

      fetch(process.env.REACT_APP_BACKEND_URL + "/getUserInfo", requestOptions)
        .then((res) => res.json())
        .then((json) => {
          if (json.result) {
            if (json.initFlg) {
              navigate("/login/updatePassword", {
                state: {
                  user: userId,
                },
              });
            } else {
              setEmpInfo(json);
              navigate("/");
            }
          } else {
            alert("ユーザーIDまたはパスワードが違います。");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer
        direction="column"
        justifyContent="space-between"
        style={{ marginTop: "50px" }}
      >
        {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          {/* <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography> */}
          <Stack justifyContent="center" alignItems="center">
            <img src={personal_name} />
          </Stack>
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <TextField
              label="社員コードまたはメールアドレス"
              color="primary"
              value={userId}
              error={isErrUserId}
              onChange={(e) => {
                setUserId(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.code === "Enter") login();
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{ marginTop: "15px" }}
            />

            <TextField
              label="パスワード"
              color="primary"
              type="password"
              value={passwd}
              error={isErrPasswd}
              onChange={(e) => {
                setPasswd(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.code === "Enter") login();
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{ marginTop: "10px" }}
            />
            <Link href="#">パスワードを忘れた場合</Link>
            <Button fullWidth variant="contained" onClick={login}>
              ログイン
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}
