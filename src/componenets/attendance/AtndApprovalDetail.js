import { useState, useEffect, useRef, FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Box from "@mui/material/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

// icon
import IconButton from "@mui/material/IconButton";
import Block from "@material-ui/icons/Block";
import CheckIcon from "@material-ui/icons/Check";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import CreateRoundedIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";

import * as CONST from "../../common/const";

import { createTheme } from "@mui/material/styles";

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

const AtndApprovalDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  // 勤怠データ
  const [diligenceData, setDiligenceData] = useState([]);

  // 差戻コメント
  const [comment, setComment] = useState("");

  const isFirstRender = useRef(true);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setLoading(true);
      setDispDiligenceData();
    }
  }, []);

  const timerRef = useRef();
  const [loading, setLoading] = useState(false);

  // 勤怠一覧にデータをセットする
  const setDispDiligenceData = () => {
    let result = [];

    const year = location.state.year;
    const month = location.state.month;
    const params = {
      user: location.state.user,
      year: location.state.year,
      month: location.state.month,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    fetch("/getAtndData", requestOptions)
      //レスポンスをjsonとして受け取りjsオブジェクトを生成
      //生成したjsオブジェクトをdataに代入
      .then((res) => res.json())
      .then((json) => {
        let data = JSON.parse(json.data);
        for (let i = 0; i < data.length; i++) {
          let weekDay = new Date(year, month - 1, data[i].day).getDay();
          let weekStr = CONST.DAY_OF_WEEKSTR_JA[weekDay];
          let day = `${data[i].day}日(${weekStr})`;

          let isHoliday = data[i].isHoliday;
          let fontColorCls = 0;
          if (isHoliday) {
            if (weekDay === 6) {
              fontColorCls = 2;
            } else {
              fontColorCls = 1;
            }
          }
          result.push({
            day: data[i].day,
            dispDay: day,
            startTime: data[i].startTime,
            endTime: data[i].endTime,
            breakTime: data[i].breakTime,
            workTime: data[i].workTime,
            overTime: data[i].overTime,
            paid: data[i].paid,
            transExp: data[i].transExp,
            remarks: data[i].remarks,
            isHoliday: isHoliday,
            fontColorCls: fontColorCls,
          });
        }

        setDiligenceData(result);
        setTimeout(() => {
          setLoading(false);
        }, 200);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // 勤怠承認・差戻
  const approvalAtndData = (approvalCls) => {
    let userList = [];
    userList[0] = location.state.user;
    const params = {
      user: userList,
      year: location.state.year,
      month: location.state.month,
      approvalCls: approvalCls,
      comment: comment,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };
    fetch("/approvalAtndData", requestOptions)
      //レスポンスをjsonとして受け取りjsオブジェクトを生成
      //生成したjsオブジェクトをdataに代入
      .then((res) => res.json())
      .then((json) => {
        if (approvalCls === "4") {
          alert("勤怠データを承認しました。");
        } else {
          alert("勤怠データを差し戻しました。");
        }
        navigate("/atndAdmin", {
          state: {
            year: location.state.year,
            month: location.state.month,
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const [isShowRemandConfirm, setIsShowRemandConfirm] = useState(false);
  const [isShowApprovalConfirm, setIsShowApprovalConfirm] = useState(false);

  // 高さ調節
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {loading ? (
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
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Typography style={{ margin: "5px" }}>
                社員氏名：{location.state.name}
              </Typography>
              <Typography style={{ margin: "7px" }}>
                {location.state.year}年{location.state.month}月
              </Typography>
            </div>
            <div>
              <TextField
                placeholder="コメント"
                variant="outlined"
                style={{ width: "600px" }}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className={classes.button}
                startIcon={<Block />}
                onClick={() => {
                  setIsShowRemandConfirm(true);
                }}
              >
                差戻
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<CheckIcon />}
                onClick={() => {
                  setIsShowApprovalConfirm(true);
                }}
                style={{ marginRight: "20px" }}
              >
                承認
              </Button>
              <Button
                variant="contained"
                color="default"
                size="large"
                className={classes.button}
                startIcon={<KeyboardReturnIcon />}
                onClick={() => {
                  navigate("/atndAdmin", {
                    state: {
                      year: location.state.year,
                      month: location.state.month,
                    },
                  });
                }}
              >
                戻る
              </Button>
            </div>
          </Box>
          <TableContainer
            component={Paper}
            style={{ height: windowHeight - 180, marginTop: "10px" }}
          >
            <Table
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ width: "100px" }}>
                    日
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "100px" }}>
                    開始時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "100px" }}>
                    終了時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "100px" }}>
                    休憩時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "100px" }}>
                    勤務時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "100px" }}>
                    残業時間
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "100px" }}>
                    有給
                  </StyledTableCell>
                  <StyledTableCell style={{ width: "200px" }}>
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
                    className={data.isHoliday ? classes.hodidayRow : ""}
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
        </>
      )}
      <div>
        <Dialog
          open={isShowRemandConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              勤怠データを差し戻します。よろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsShowRemandConfirm(false);
              }}
              variant="contained"
              color="default"
            >
              いいえ
            </Button>
            <Button
              variant="contained"
              color="primary"
              autoFocus
              onClick={() => {
                setIsShowRemandConfirm(false);
                approvalAtndData("3");
              }}
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isShowApprovalConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              勤怠データを承認します。よろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsShowApprovalConfirm(false);
              }}
              variant="contained"
              color="default"
            >
              いいえ
            </Button>
            <Button
              variant="contained"
              color="primary"
              autoFocus
              onClick={() => {
                setIsShowApprovalConfirm(false);
                approvalAtndData("4");
              }}
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AtndApprovalDetail;
