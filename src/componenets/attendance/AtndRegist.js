import { useState, useEffect, useRef, FC } from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// icon
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import SaveIcon from "@mui/icons-material/Save";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DescriptionIcon from "@mui/icons-material/Description";

import * as CONST from "../../common/const";

import { createTheme } from "@mui/material/styles";

import { calcTime, transTime } from "../../common/common";
import { userId, sysUseStartYear, sysUseStartMonth } from "../../common/Global";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1025,
      xl: 1536,
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 15,
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    paddingTop: 12,
    paddingBottom: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    minWidth: 120,
  },
  textBox: {
    width: "100%",
    padding: "1px",
  },
  hodidayRow: {
    backgroundColor: theme.palette.action.hover,
  },
  blueCell: {
    color: "#3f51b5 !important",
  },
  redCell: {
    color: "#ff1744 !important",
  },
  todayCell: {
    backgroundColor: "#ffcdd2 !important",
  },
  approvedText: {
    padding: 5.5,
    fontSize: "16px",
  },
}));

const AtndRegist = () => {
  const classes = useStyles();

  // 勤怠データ（編集前）
  const [orgDiligenceData, setOrgDiligenceData] = useState([]);
  // 勤怠データ（編集用）
  const [diligenceData, setDiligenceData] = useState([]);

  // 登録済みデータかどうか
  const [isRegistered, setIsRegistered] = useState(false);

  // 承認済みかどうか
  const [isApproved, setIsApproved] = useState(false);

  // 表示年
  const [dispYear, setDispYear] = useState("");
  // 表示月
  const [dispMonth, setDispMonth] = useState("");

  // 月末申請ボタン表示
  const [isDispApplyBtn, setIsDispApplyBtn] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      const dt = new Date();
      const year = dt.getFullYear();
      const month = dt.getMonth() + 1;
      setLoading(true);
      setTimeout(() => {
        setDispDiligenceData(year, month);
      }, 200);
    }
  }, []);

  // 表示月の祝日を取得する
  const getHoliday = (year, month) => {
    let JapaneseHolidays = require("japanese-holidays");
    let result = JapaneseHolidays.getHolidaysOf(year)
      .filter((d) => d.month === month)
      .map((d) => d.date);
    return result;
  };

  const timerRef = useRef();
  const [loading, setLoading] = useState(false);

  // 勤怠一覧にデータをセットする
  const setDispDiligenceData = (year, month) => {
    const stringYear = String(year);
    const stringMonth = String(month).padStart(2, "0");

    const lastDay = new Date(year, month, 0).getDate();
    let holidays = getHoliday(year, month);
    let result = [];
    setDispYear(stringYear);
    setDispMonth(stringMonth);

    let dt = new Date();
    let currentYear = dt.getFullYear();
    let currentMonth = dt.getMonth() + 1;
    let currentDay = dt.getDate();

    let dateCls = 0; // -1:先月以前,0:今月,1:来月以降
    let registeredata = [];
    let isApproved = false;

    if ((currentYear === year && currentMonth > month) || currentYear > year) {
      // 先月以前
      dateCls = -1;
    } else if (
      (currentYear === year && currentMonth < month) ||
      currentYear < year
    ) {
      // 来月以降
      dateCls = 1;
    }

    const params = {
      user: userId,
      year: stringYear,
      month: stringMonth,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    fetch(process.env.REACT_APP_BACKEND_URL + "/getAtndData", requestOptions)
      //レスポンスをjsonとして受け取りjsオブジェクトを生成
      //生成したjsオブジェクトをdataに代入
      .then((res) => res.json())
      .then((json) => {
        if (json.data.length > 0) {
          registeredata = JSON.parse(json.data);
        } else {
          registeredata = [];
          setIsRegistered(false);
        }
        isApproved = json.isApproved;
        setIsRegistered(json.isRegistered);
        for (let i = 1; i <= lastDay; i++) {
          let weekDay = new Date(year, month - 1, i).getDay();
          let weekStr = CONST.DAY_OF_WEEKSTR_JA[weekDay];
          let day = `${i}日(${weekStr})`;

          let isHoliday = false;
          let fontColorCls = 0;
          if (holidays.includes(i)) {
            isHoliday = true;
            fontColorCls = 1;
          } else {
            if (weekDay === 0) {
              isHoliday = true;
              fontColorCls = 1;
            } else if (weekDay === 6) {
              isHoliday = true;
              fontColorCls = 2;
            }
          }

          let isToday = dateCls === 0 && i === currentDay ? true : false;

          let blankData = {
            check: false,
            day: i,
            dispDay: day,
            startTime: "",
            endTime: "",
            breakTime: "",
            workTime: "",
            overTime: "",
            paid: "",
            transExp: 0,
            remarks: "",
            isHoliday: isHoliday,
            isToday: isToday,
            fontColorCls: fontColorCls,
            isMinus: false,
          };

          if (registeredata.length > 0) {
            let filteredData = registeredata.find((d) => d.day === i);
            if (filteredData) {
              let data = {
                check: false,
                day: i,
                dispDay: day,
                startTime: filteredData.startTime,
                endTime: filteredData.endTime,
                breakTime: filteredData.breakTime,
                workTime: filteredData.workTime,
                overTime: filteredData.overTime,
                paid: filteredData.paid,
                transExp: filteredData.transExp,
                remarks: filteredData.remarks,
                isHoliday: isHoliday,
                isToday: isToday,
                fontColorCls: fontColorCls,
                isMinus: false,
              };
              result.push(data);
            } else {
              result.push(blankData);
            }
          } else {
            result.push(blankData);
          }
        }

        let bussDays = result.filter((d) => !d.isHoliday);
        let lastBussDay = String(bussDays[bussDays.length - 1].day);

        if (
          !isApproved &&
          new Date() >= new Date(`${year}/${month}/${lastBussDay}`)
        ) {
          setIsDispApplyBtn(true);
        } else {
          setIsDispApplyBtn(false);
        }

        setDiligenceData(result);
        setOrgDiligenceData(result);
        setIsApproved(isApproved);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const [moveButton, setMoveButton] = useState(1); // 1:前の月に移動、2:次の月に移動

  // 前の月に移動
  const onClickBack = () => {
    let newYear = Number(dispYear);
    let newMonth = Number(dispMonth) - 1;
    if (newMonth === 0) {
      newYear--;
      newMonth = 12;
    }

    setDispYear(String(newYear));
    setDispMonth(String(newMonth).padStart(2, "0"));
    setLoading(true);
    setTimeout(() => {
      setDispDiligenceData(newYear, newMonth);
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
    setDispYear(String(newYear));
    setDispMonth(String(newMonth).padStart(2, "0"));
    setLoading(true);
    setTimeout(() => {
      setDispDiligenceData(newYear, newMonth);
    }, 200);
  };

  // 編集中チェック
  const checkEditing = () => {
    let result = false;
    for (let i = 0; i < diligenceData.length; i++) {
      if (
        diligenceData[i].startTime !== orgDiligenceData[i].startTime ||
        diligenceData[i].endTime !== orgDiligenceData[i].endTime ||
        diligenceData[i].breakTime !== orgDiligenceData[i].breakTime ||
        diligenceData[i].transExp !== orgDiligenceData[i].transExp ||
        diligenceData[i].remarks !== orgDiligenceData[i].remarks
      ) {
        result = true;
        break;
      }
    }
    return result;
  };

  // 値更新
  const updateData = (day, column, value) => {
    let newData = JSON.parse(JSON.stringify(diligenceData));
    let index = newData.findIndex((d) => d.day === day);

    switch (column) {
      case 1:
        if (newData[index].check) {
          newData[index].check = false;
        } else {
          newData[index].check = true;
        }
        break;
      case 2:
        newData[index].startTime = value;
        const time = calcTime(
          value,
          newData[index].endTime,
          newData[index].breakTime
        );
        newData[index].workTime = transTime(time.workSec);
        newData[index].overTime = transTime(time.overSec);
        newData[index].isMinus = time.isMinus;
        break;
      case 3:
        newData[index].endTime = value;
        const time2 = calcTime(
          newData[index].startTime,
          value,
          newData[index].breakTime
        );
        newData[index].workTime = transTime(time2.workSec);
        newData[index].overTime = transTime(time2.overSec);
        newData[index].isMinus = time2.isMinus;
        break;
      case 4:
        newData[index].breakTime = value;
        const time3 = calcTime(
          newData[index].startTime,
          newData[index].endTime,
          value
        );
        newData[index].workTime = transTime(time3.workSec);
        newData[index].overTime = transTime(time3.overSec);
        newData[index].isMinus = time3.isMinus;
        break;
      case 5:
        newData[index].paid = value;
        break;
      case 6:
        newData[index].transExp = value;
        break;
      case 7:
        newData[index].remarks = value;
        break;
      case 8:
        newData[index].startTime = "";
        newData[index].endTime = "";
        newData[index].breakTime = "";
        newData[index].workTime = "";
        newData[index].overTime = "";
        newData[index].paid = "";
        newData[index].transExp = "";
        newData[index].remarks = "";
        break;
    }
    console.log(newData[index]);
    setDiligenceData(newData);
  };

  const [isShowSaveConfirm, setIsShowSaveConfirm] = useState(false);
  const [isShowMoveConfirm, setIsShowMoveConfirm] = useState(false);

  const saveData = () => {
    setIsShowSaveConfirm(false);
    let data = diligenceData.map((obj) => {
      const { check, dispDay, isToday, fontColorCls, ...newObj } = obj;
      return newObj;
    });
    const params = {
      user: userId,
      year: dispYear,
      month: dispMonth,
      data: JSON.stringify(data),
      isRegistered: isRegistered,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    fetch(process.env.REACT_APP_BACKEND_URL + "/saveAtndData", requestOptions)
      .then((res) => res.json())
      .then((json) => {
        alert("勤怠情報を登録しました");
        setOrgDiligenceData(diligenceData);
        // setIsShowAlert(true);
        // setSeverityNum(0);
        // setAlertMessage("勤怠情報を登録しました");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const onSelectAllClick = (e) => {
    let newData = JSON.parse(JSON.stringify(diligenceData));
    for (let i = 0; i < newData.length; i++) {
      if (e.target.checked) {
        if (!newData[i].isHoliday) newData[i].check = true;
      } else {
        newData[i].check = false;
      }
    }
    setDiligenceData(newData);
  };

  const [bulkStartTime, setBulkStartTime] = useState("");
  const [bulkEndTime, setBulkEndTime] = useState("");
  const [bulkBreakTime, setBulkBreakTime] = useState("");
  const [bulkPaid, setBulkPaid] = useState("");

  // 一括入力
  const batchInput = () => {
    let newData = JSON.parse(JSON.stringify(diligenceData));
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].check) {
        newData[i].check = false;
        newData[i].startTime = bulkStartTime;
        newData[i].endTime = bulkEndTime;
        newData[i].breakTime = bulkBreakTime;
        let time = calcTime(bulkStartTime, bulkEndTime, bulkBreakTime);
        newData[i].workTime = transTime(time.workSec);
        newData[i].overTime = transTime(time.overSec);
        newData[i].paid = bulkPaid;
        newData[i].isMinus = time.isMinus;
      }
    }
    setDiligenceData(newData);
    setBulkStartTime("");
    setBulkEndTime("");
    setBulkBreakTime("");
    setBulkPaid("");
  };

  const [windowHeight, setWindowHeight] = useState(window.innerHeight - 145);
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight - 145);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{ display: "flex", marginBottom: "5px", lineHeight: "35px" }}
        >
          <IconButton
            onClick={() => {
              let isEditing = false;
              if (!isApproved) isEditing = checkEditing();
              if (isEditing) {
                setMoveButton(1);
                setIsShowMoveConfirm(true);
              } else {
                onClickBack();
              }
            }}
            disabled={
              `${sysUseStartYear}${sysUseStartMonth}` ===
              `${dispYear}${dispMonth}`
            }
          >
            <ArrowLeftIcon fontSize="large" />
          </IconButton>
          <TextField
            type="month"
            value={`${dispYear}-${dispMonth}`}
            slotProps={{
              input: {
                style: {
                  backgroundColor: "#f0f0f0",
                },
                min: `${sysUseStartYear}-${sysUseStartMonth}`,
              },
            }}
            size="small"
            onChange={(e) => {
              if (e.target.value === "") return;
              let date = e.target.value.split("-");
              let year = date[0];
              let month = date[1];
              setDispYear(year);
              setDispMonth(month.padStart(2, "0"));
              setTimeout(() => {
                setDispDiligenceData(Number(year), Number(month));
              }, 200);
            }}
            style={{ marginTop: "8px" }}
          />
          <IconButton
            onClick={() => {
              let isEditing = false;
              if (!isApproved) isEditing = checkEditing();
              if (isEditing) {
                setMoveButton(2);
                setIsShowMoveConfirm(true);
              } else {
                onClickNext();
              }
            }}
          >
            <ArrowRightIcon fontSize="large" />
          </IconButton>
        </div>
        {!loading && (
          <div>
            {!isApproved && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                onClick={() => {
                  setIsShowSaveConfirm(true);
                }}
              >
                保存
              </Button>
            )}
            {isDispApplyBtn && (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className={classes.button}
                startIcon={<DescriptionIcon />}
                onClick={() => {
                  setIsShowSaveConfirm(true);
                }}
              >
                月末申請
              </Button>
            )}
          </div>
        )}
      </Box>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "50px",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {!loading && isApproved && (
        <TableContainer component={Paper} style={{ height: windowHeight - 15 }}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: "7%" }}>日</StyledTableCell>
                <StyledTableCell style={{ width: "8%" }}>
                  開始時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "8%" }}>
                  終了時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "8%" }}>
                  休憩時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "8%" }}>
                  勤務時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "8%" }}>
                  残業時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "8%" }}>有給</StyledTableCell>
                <StyledTableCell style={{ width: "10%" }}>
                  交通費
                </StyledTableCell>
                <StyledTableCell>備考</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diligenceData.map((data, index) => (
                <StyledTableRow
                  key={data.day}
                  style={{ margin: 0 }}
                  className={
                    data.isToday
                      ? classes.todayCell
                      : data.isHoliday
                      ? classes.hodidayRow
                      : ""
                  }
                  aria-checked={data.check}
                  selected={data.check}
                >
                  <StyledTableCell
                    className={
                      data.fontColorCls === 1
                        ? classes.redCell
                        : data.fontColorCls === 2
                        ? classes.blueCell
                        : ""
                    }
                  >
                    {data.dispDay}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.startTime === "" ? "　" : data.startTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.endTime === "" ? "　" : data.endTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell style={{}}>
                    <div className={classes.approvedText}>
                      {data.breakTime === "" ? "　" : data.breakTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.workTime === "" ? "　" : data.workTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.overTime === "" ? "　" : data.overTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.paid === "" ? "　" : data.paid}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.transExp === 0 ? "　" : data.transExp}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: {
                        xs: "none",
                        sm: "block",
                      },
                    }}
                  >
                    <div className={classes.approvedText}>
                      {data.remarks === "" ? "　" : data.remarks}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: {
                        sm: "none",
                      },
                    }}
                  >
                    <IconButton
                      color="primary"
                      style={{ padding: 5 }}
                      // onClick={() => {
                      //   updateData(data.day, 8, null);
                      // }}
                    >
                      <CreateRoundedIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!loading && !isApproved && (
        <>
          <Box sx={{ my: 2 }}>
            <TextField
              type="time"
              label="開始時間"
              slotProps={{
                input: {
                  style: {
                    backgroundColor: "#f0f0f0",
                  },
                },
                inputLabel: {
                  shrink: true,
                },
              }}
              value={bulkStartTime}
              onChange={(e) => {
                setBulkStartTime(e.target.value);
              }}
              style={{ marginRight: "5px", backgroundColor: "fff" }}
              variant="outlined"
              size="small"
            />
            <TextField
              type="time"
              label="終了時間"
              slotProps={{
                input: {
                  style: {
                    backgroundColor: "#f0f0f0",
                  },
                },
                inputLabel: {
                  shrink: true,
                },
              }}
              value={bulkEndTime}
              onChange={(e) => {
                setBulkEndTime(e.target.value);
              }}
              style={{ marginRight: "5px" }}
              variant="outlined"
              size="small"
            />
            <TextField
              type="time"
              label="休憩時間"
              slotProps={{
                input: {
                  style: {
                    backgroundColor: "#f0f0f0",
                  },
                },
                inputLabel: {
                  shrink: true,
                },
              }}
              value={bulkBreakTime}
              onChange={(e) => {
                setBulkBreakTime(e.target.value);
              }}
              style={{ marginRight: "10px" }}
              variant="outlined"
              size="small"
            />
            <TextField
              type="time"
              label="有給"
              slotProps={{
                input: {
                  style: {
                    backgroundColor: "#f0f0f0",
                  },
                },
                inputLabel: {
                  shrink: true,
                },
              }}
              value={bulkPaid}
              onChange={(e) => {
                setBulkPaid(e.target.value);
              }}
              style={{ marginRight: "10px" }}
              variant="outlined"
              size="small"
            />
            <Button
              onClick={batchInput}
              variant="contained"
              color="primary"
              style={{ height: "40px" }}
              disabled={!diligenceData.some((d) => d.check)}
            >
              一括入力
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            style={{ height: windowHeight - 90 }}
          >
            <Table
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell padding="checkbox" style={{ width: "50px" }}>
                    <Tooltip
                      title={
                        diligenceData.some((d) => !d.isHoliday && !d.check)
                          ? "営業日を一括選択"
                          : "一括選択を解除"
                      }
                      style={{ fontSize: "10px" }}
                      placement="right"
                      arrow
                    >
                      <Checkbox
                        style={{
                          padding: "12px",
                          color: "white",
                        }}
                        checked={
                          !diligenceData.some((d) => !d.isHoliday && !d.check)
                        }
                        onChange={onSelectAllClick}
                        inputProps={{ "aria-label": "select all desserts" }}
                      />
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "6%" }}>日</StyledTableCell>
                  <StyledTableCell style={{ width: "7%" }}>
                    開始時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "7%" }}>
                    終了時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "7%" }}>
                    休憩時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "7%" }}>
                    勤務時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "7%" }}>
                    残業時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "7%" }}>
                    有給
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "10%" }}>
                    交通費
                  </StyledTableCell>
                  <StyledTableCell>備考</StyledTableCell>
                  <StyledTableCell style={{ width: "50px" }}></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {diligenceData.map((data, index) => {
                  let labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <StyledTableRow
                      key={data.day}
                      style={{ margin: 0 }}
                      className={
                        data.isToday
                          ? classes.todayCell
                          : data.isHoliday
                          ? classes.hodidayRow
                          : ""
                      }
                      aria-checked={data.check}
                      selected={data.check}
                    >
                      <StyledTableCell>
                        <Checkbox
                          style={{ padding: 0 }}
                          checked={data.check}
                          onClick={() => {
                            updateData(data.day, 1, null);
                          }}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        className={
                          data.fontColorCls === 1
                            ? classes.redCell
                            : data.fontColorCls === 2
                            ? classes.blueCell
                            : ""
                        }
                      >
                        {data.dispDay}
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          type="time"
                          value={data.startTime}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                            input: {
                              step: 1800,
                            },
                          }}
                          onChange={(e) => {
                            updateData(data.day, 2, e.target.value);
                          }}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          type="time"
                          value={data.endTime}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                            input: {
                              step: 1800,
                            },
                          }}
                          onChange={(e) => {
                            updateData(data.day, 3, e.target.value);
                          }}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell style={{}}>
                        <TextField
                          type="time"
                          value={data.breakTime}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                            input: {
                              step: 1800,
                            },
                          }}
                          onChange={(e) => {
                            updateData(data.day, 4, e.target.value);
                          }}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <div
                          className={`classes.approvedText ${
                            data.isMinus && classes.redCell
                          }`}
                        >
                          {data.workTime === "" ? "　" : data.workTime}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className={classes.approvedText}>
                          {data.overTime === "" ? "　" : data.overTime}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          type="time"
                          value={data.paid}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                            input: {
                              step: 1800,
                            },
                          }}
                          onChange={(e) => {
                            updateData(data.day, 5, e.target.value);
                          }}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <TextField
                          type="number"
                          className={classes.textBox}
                          value={data.transExp === 0 ? "" : data.transExp}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onChange={(e) => {
                            updateData(data.day, 6, e.target.value);
                          }}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          display: {
                            xs: "none",
                            sm: "block",
                          },
                        }}
                      >
                        <TextField
                          className={classes.textBox}
                          value={data.remarks}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          onChange={(e) => {
                            updateData(data.day, 7, e.target.value);
                          }}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          display: {
                            sm: "none",
                          },
                        }}
                      >
                        <IconButton color="primary" style={{ padding: 5 }}>
                          <CreateRoundedIcon />
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          color="primary"
                          style={{ padding: 5 }}
                          onClick={() => {
                            updateData(data.day, 8, null);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <div>
        <Dialog
          open={isShowSaveConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              入力内容を保存します。よろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsShowSaveConfirm(false);
              }}
              variant="contained"
              color="default"
            >
              いいえ
            </Button>
            <Button
              onClick={saveData}
              variant="contained"
              color="primary"
              autoFocus
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isShowMoveConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              入力内容が破棄されます。移動してよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsShowMoveConfirm(false);
              }}
              variant="contained"
              color="default"
            >
              いいえ
            </Button>
            <Button
              onClick={() => {
                if (moveButton === 1) {
                  onClickBack();
                } else {
                  onClickNext();
                }
                setIsShowMoveConfirm(false);
              }}
              variant="contained"
              color="primary"
              autoFocus
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AtndRegist;
