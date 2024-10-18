import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createStyles, makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";

import ProjectList from "./ProjectList";
import Profile from "./Profile";

import { userId } from "../../common/Global";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    blueCell: {
      color: "#3f51b5 !important",
    },
    redCell: {
      color: "#ff1744 !important",
    },
  })
);

// カスタムテーマ
const theme = createTheme({
  palette: {
    secondary: {
      main: "#f50057",
    },
  },
});

/**
 * メイン画面
 */
const SkillsheetMain = () => {
  const classes = useStyles();

  // タブindex
  const [value, setValue] = React.useState(0);
  // タブ選択
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const [isLoading, setIsLoading] = useState(false);

  const StyledTabs = styled(Tabs)({
    "& .MuiTabs-indicator": {
      backgroundColor: "#f50057", // カスタム色
      height: "1px", // インジケーターの太さを調整
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // 影を追加
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {/* {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "50px",
            }}
          >
            <CircularProgress />
          </div>
        ) : ( */}
        <AppBar position="static">
          <StyledTabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="プロジェクト一覧" id="tab1" aria-controls="tabpanel1" />
            <Tab label="プロフィール" id="tab2" aria-controls="tabpanel2" />
          </StyledTabs>
        </AppBar>
        {value === 0 && <ProjectList />}
        {value === 1 && <Profile />}
        {/* )} */}
      </div>
    </ThemeProvider>
  );
};

export default SkillsheetMain;
