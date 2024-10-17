import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import CircularProgress from "@material-ui/core/CircularProgress";

// icon
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { userId } from "../../common/Global";
import { calcTime, transTime, transSec } from "../../common/common";

import UnapprovedList from "./UnapprovedList";
import UnappliedList from "./UnappliedList";
import ApprovedList from "./ApprovedList";

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

/**
 * メイン画面
 */
const AtndAdminMain = () => {
  const location = useLocation();
  const classes = useStyles();

  // 表示年
  const [dispYear, setDispYear] = useState("");
  // 表示月
  const [dispMonth, setDispMonth] = useState("");
  // 最大表示年月
  const [maxDispDate, setMaxDispDate] = useState("");

  // 承認待ちデータ
  const [appliedData, setAppliedData] = useState([]);

  // 未申請データ
  const [unappliedData, setUnappliedData] = useState([]);

  // 承認済みデータ
  const [approvedData, setApprovedData] = useState([]);

  // タブindex
  const [value, setValue] = React.useState(0);
  // タブ選択
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dt = new Date();
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth === 0) {
      newYear--;
      newMonth = 12;
    }
    const currentYear = String(newYear);
    const currentMonth = String(newMonth).padStart(2, "0");

    let stringYear = "";
    let stringMonth = "";
    if (location.state) {
      stringYear = location.state.year;
      stringMonth = location.state.month;
    } else {
      stringYear = currentYear;
      stringMonth = currentMonth;
    }

    setDispYear(stringYear);
    setDispMonth(stringMonth);
    setMaxDispDate(`${currentYear}-${currentMonth}`);
    setTimeout(() => {
      getForAdminAtndData(stringYear, stringMonth);
    }, 200);
  }, []);

  const getForAdminAtndData = async (year, month) => {
    const params = {
      user: userId,
      year: year,
      month: month,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    await fetch(
      process.env.REACT_APP_BACKEND_URL + "/getForAdminAtndData",
      requestOptions
    )
      .then((res) => res.json())
      .then((json) => {
        let newAppliedData = [];
        let newUnappliedData = [];
        let newApprovedData = [];
        for (let i = 0; i < json.length; i++) {
          let row = json[i];
          if (row.approvalCls === "2" || row.approvalCls === "4") {
            let totalDay = 0;
            let overSec = 0;
            let totalSec = 0;
            let paidSec = 0;
            let transExp = 0;
            let excessSec = 0;
            let holidayWorkNum = 0;
            let atndDatas = JSON.parse(row.data);
            for (let j = 0; j < atndDatas.length; j++) {
              let time = calcTime(
                atndDatas[j].startTime,
                atndDatas[j].endTime,
                atndDatas[j].breakTime
              );
              totalSec += time.workSec;
              overSec += time.overSec;
              if (time.workSec > 0 && atndDatas[j].isHoliday) {
                holidayWorkNum += 1;
              }
              paidSec += transSec(atndDatas[j].paid);
              if (time.workSec > 0) {
                totalDay++;
              }
              if (atndDatas[j].transExp !== "") {
                transExp += parseInt(atndDatas[j].transExp);
              }
            }
            let timeFrameFrom = transSec(row.timeFrameFrom);
            let timeFrameTo = transSec(row.timeFrameTo);

            let excess = "00:00";
            let excessCls = 0;
            if (timeFrameFrom > totalSec) {
              excessSec = timeFrameFrom - totalSec;
              excess = transTime(excessSec);
              excessCls = 1;
            } else if (timeFrameTo < totalSec) {
              excessSec = totalSec - timeFrameTo;
              excess = transTime(excessSec);
              excessCls = 2;
            }
            if (row.approvalCls === "2") {
              newAppliedData.push({
                index: newAppliedData.length,
                userId: row.userId,
                name: row.userName,
                totalDay: `${totalDay}日`,
                holidayWork: `${holidayWorkNum}日`,
                totalTime: transTime(totalSec, 3),
                over: transTime(overSec),
                excess: excessCls === 1 ? `${excess} (-)` : `${excess} (+)`,
                excessCls: excessCls,
                paid: transTime(paidSec),
                transExp: transExp.toLocaleString(),
                timeFrame: `${row.timeFrameFrom}-${row.timeFrameTo}`,
                projectName: row.projectName,
                year: row.year,
                month: row.month,
              });
            } else if (row.approvalCls === "4") {
              newApprovedData.push({
                index: newApprovedData.length,
                userId: row.userId,
                name: row.userName,
                data: row.data,
                totalDay: `${totalDay}日`,
                holidayWork: `${holidayWorkNum}日`,
                totalTime: transTime(totalSec, 3),
                over: transTime(overSec),
                paid: transTime(paidSec),
                transExp: transExp.toLocaleString(),
                excess: excessCls === 1 ? `-${excess}` : excess,
                timeFrame: `${row.timeFrameFrom}-${row.timeFrameTo}`,
                projectName: row.projectName,
              });
            }
          } else {
            let data = {
              index: newUnappliedData.length,
              userId: row.userId,
              name: row.userName,
            };
            newUnappliedData.push(data);
          }
        }
        setAppliedData(newAppliedData);
        setUnappliedData(newUnappliedData);
        setApprovedData(newApprovedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  // 前の月に移動
  const onClickBack = () => {
    let newYear = Number(dispYear);
    let newMonth = Number(dispMonth) - 1;
    if (newMonth === 0) {
      newYear--;
      newMonth = 12;
    }

    const stringYear = String(newYear);
    const stringMonth = String(newMonth).padStart(2, "0");
    setDispYear(stringYear);
    setDispMonth(stringMonth);
    setTimeout(() => {
      getForAdminAtndData(stringYear, stringMonth);
    }, 200);
  };

  // 次の月に移動
  const onClickNext = () => {
    let newYear = Number(dispYear);
    let newMonth = Number(dispMonth) + 1;
    if (newMonth === 13) {
      newYear++;
      newMonth = 1;
    }
    const stringYear = String(newYear);
    const stringMonth = String(newMonth).padStart(2, "0");
    setDispYear(stringYear);
    setDispMonth(stringMonth);
    setTimeout(() => {
      getForAdminAtndData(stringYear, stringMonth);
    }, 200);
  };

  return (
    <>
      <div className={classes.root}>
        <div
          style={{
            display: "flex",
            lineHeight: "35px",
            marginBottom: "10px",
          }}
        >
          <IconButton
            onClick={() => {
              setIsLoading(true);
              onClickBack();
            }}
          >
            <ArrowLeftIcon fontSize="large" />
          </IconButton>
          <TextField
            type="month"
            value={`${dispYear}-${dispMonth}`}
            inputProps={{
              max: maxDispDate,
            }}
            onChange={(e) => {
              if (e.target.value === "") return;
              let date = e.target.value.split("-");
              let year = date[0];
              let month = date[1];
              setDispYear(year);
              setDispMonth(month.padStart(2, "0"));

              setIsLoading(true);
              setTimeout(() => {
                getForAdminAtndData(year, month);
              }, 200);
            }}
            style={{ marginTop: "8px" }}
          />
          <IconButton
            onClick={() => {
              setIsLoading(true);
              onClickNext();
            }}
            disabled={`${dispYear}-${dispMonth}` === maxDispDate}
          >
            <ArrowRightIcon fontSize="large" />
          </IconButton>
        </div>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "50px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <AtndAdminTabs
            dispYear={dispYear}
            dispMonth={dispMonth}
            value={value}
            appliedData={appliedData}
            unappliedData={unappliedData}
            approvedData={approvedData}
            handleChange={handleChange}
            getForAdminAtndData={getForAdminAtndData}
          />
        )}
      </div>
    </>
  );
};

function AtndAdminTabs(props) {
  const {
    dispYear,
    dispMonth,
    value,
    appliedData,
    unappliedData,
    approvedData,
    handleChange,
    getForAdminAtndData,
  } = props;

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab
            label={
              <Badge badgeContent={appliedData.length} color="error">
                承認待ち&nbsp;&nbsp;
              </Badge>
            }
            id="tab1"
            aria-controls="tabpanel1"
          />
          <Tab
            label={
              <Badge badgeContent={unappliedData.length} color="error">
                未申請&nbsp;&nbsp;
              </Badge>
            }
            id="tab2"
            aria-controls="tabpanel2"
          />
          <Tab
            label={
              <Badge badgeContent={approvedData.length} color="error">
                承認済み&nbsp;&nbsp;
              </Badge>
            }
            id="tab3"
            aria-controls="tabpanel3"
          />
        </Tabs>
      </AppBar>
      {value === 0 && (
        <UnapprovedList
          dispYear={dispYear}
          dispMonth={dispMonth}
          dispData={appliedData}
          getForAdminAtndData={getForAdminAtndData}
        />
      )}
      {value === 1 && (
        <UnappliedList
          dispYear={dispYear}
          dispMonth={dispMonth}
          dispData={unappliedData}
        />
      )}
      {value === 2 && (
        <ApprovedList
          dispYear={dispYear}
          dispMonth={dispMonth}
          dispData={approvedData}
        />
      )}
    </div>
  );
}

export default AtndAdminMain;
