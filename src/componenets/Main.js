import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
// import { Suspense } from "react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
// import Alert from "@material-ui/lab/Alert";
// import Snackbar from "@material-ui/core/Snackbar";
import Slide, { SlideProps } from "@mui/material//Slide";
// import LinearProgress from "@material-ui/core/LinearProgress";
import { userId } from "../common/Global";

import Navigator from "./Navigator";
import Header from "./Header";
// import AtndRegist from "./AtndRegist";
// import PatternRegist from "./PatternRegist";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

let theme = createTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
    secondary: {
      main: "#f50054",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

const useStyles = styled((theme) => ({
  root: {
    width: "100%",
  },
}));

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#081627",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#4fc3f7",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

export default function Main() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [isShowAlert, setIsShowAlert] = useState(false);
  const [severityNum, setSeverityNum] = useState(0);
  const severityMap = {
    0: "success",
    1: "info",
    2: "warning",
    3: "error",
  };

  const [alertMessage, setAlertMessage] = useState("");

  const [pageLoadingRate, setPageLoadingRate] = useState(0);

  useEffect(() => {
    if (userId === "") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (pageLoadingRate === 100) {
      setPageLoadingRate(0);
    }
  }, [pageLoadingRate]);

  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }

  // const DiligencePage = () => {
  //   return (
  //     <AtndRegist
  //       setIsShowAlert={setIsShowAlert}
  //       setSeverityNum={setSeverityNum}
  //       setAlertMessage={setAlertMessage}
  //       setPageLoadingRate={setPageLoadingRate}
  //     />
  //   );
  // };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{
                style: { width: drawerWidth },
              }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header onDrawerToggle={handleDrawerToggle} />
          {/* <Suspense fallback={<LinearProgress />}> */}
          <Box
            component="main"
            sx={{ flex: 1, py: 2, px: 4, bgcolor: "#eaeff1" }}
          >
            <div className={classes.root}>
              <Outlet />
              {/* <Snackbar
                className={classes.root}
                open={isShowAlert}
                onClose={() => {
                  setIsShowAlert(false);
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                autoHideDuration={3000}
                TransitionComponent={TransitionDown}
              >
                <Alert
                  style={{ marginTop: "50px", width: "50%" }}
                  severity={severityMap[severityNum]}
                >
                  {alertMessage}
                </Alert>
              </Snackbar> */}
            </div>
          </Box>
          {/* <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
            <Copyright />
          </Box> */}
          {/* </Suspense> */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
