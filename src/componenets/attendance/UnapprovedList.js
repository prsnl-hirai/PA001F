import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import ComfirmDialog from "../common/ComfirmDialog";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
    },
    table: {
      minWidth: 750,
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
 * 承認待ちタブ
 */
const UnapprovedList = (props) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { dispYear, dispMonth, dispData, getForAdminAtndData } = props;

  // 選択済み承認対象
  const [selectedData, setSelectedData] = useState([]);

  const isSelected = (userId) => selectedData.indexOf(userId) !== -1;

  const handleClick = (userId) => {
    let newSelected = JSON.parse(JSON.stringify(selectedData));
    if (selectedData.includes(userId)) {
      newSelected = newSelected.filter((d) => d !== userId);
    } else {
      newSelected.push(userId);
    }
    setSelectedData(newSelected);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = dispData.map((n) => n.userId);
      setSelectedData(newSelecteds);
      return;
    }
    setSelectedData([]);
  };

  useEffect(() => {
    setSelectedData([]);
  }, [dispYear, dispMonth]);

  // 勤怠承認
  const approvalAtndData = () => {
    const params = {
      user: selectedData,
      year: dispYear,
      month: dispMonth,
      approvalCls: "4",
      comment: null,
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
        alert("勤怠データを一括承認しました。");
        getForAdminAtndData(dispYear, dispMonth);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // ダイアログ表示管理state
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [message, setMessage] = useState("");

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
      <Paper className={classes.paper} style={{ height: windowHeight - 210 }}>
        <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: selectedData.length > 0,
          })}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={selectedData.length === 0}
            // className={classes.button}
            // startIcon={<SaveIcon />}
            onClick={() => {
              setIsShowDialog(true);
              setMessage("選択した社員を一括承認します。よろしいですか？");
            }}
          >
            一括承認
          </Button>
        </Toolbar>
        <TableContainer>
          <Table
            className={classes.table}
            stickyHeader
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selectedData.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={dispData.length}
            />
            <TableBody>
              {dispData.map((row, index) => {
                const isItemSelected = isSelected(row.userId);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={index}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={() => {
                          handleClick(row.userId);
                        }}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} padding="none">
                      {row.userId}
                    </TableCell>
                    <TableCell scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell padding="none">{row.totalDay}</TableCell>
                    <TableCell padding="none">{row.holidayWork}</TableCell>
                    <TableCell padding="none">{row.totalTime}</TableCell>
                    <TableCell padding="none">{row.over}</TableCell>
                    <TableCell
                      padding="none"
                      className={
                        row.excessCls === 1
                          ? classes.redCell
                          : row.excessCls === 2
                          ? classes.blueCell
                          : ""
                      }
                    >
                      {row.excess}
                    </TableCell>
                    <TableCell padding="none">{row.timeFrame}</TableCell>
                    <TableCell padding="none">{row.projectName}</TableCell>
                    <TableCell padding="default" align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        // className={classes.button}
                        // startIcon={<SaveIcon />}
                        onClick={() => {
                          navigate("/atndAdmin/unapproved", {
                            state: {
                              user: row.userId,
                              name: row.name,
                              year: dispYear,
                              month: dispMonth,
                            },
                          });
                        }}
                      >
                        参照
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div>
        <ComfirmDialog
          isShow={isShowDialog}
          setIsShow={setIsShowDialog}
          message={message}
          onClickOk={approvalAtndData}
        />
      </div>
    </>
  );
};

const headCells = [
  {
    id: "userId",
    numeric: false,
    disablePadding: true,
    label: "社員ID",
    width: "10%",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "社員氏名",
    width: "10%",
  },
  {
    id: "totalDay",
    numeric: false,
    disablePadding: true,
    label: "出勤日数",
    width: "8%",
  },
  {
    id: "holidayWork",
    numeric: false,
    disablePadding: true,
    label: "休日出勤",
    width: "8%",
  },
  {
    id: "totalTime",
    numeric: false,
    disablePadding: true,
    label: "合計時間",
    width: "8%",
  },
  {
    id: "over",
    numeric: false,
    disablePadding: true,
    label: "残業時間",
    width: "8%",
  },
  {
    id: "excess",
    numeric: false,
    disablePadding: true,
    label: "超過時間",
    width: "8%",
  },
  {
    id: "timeFrame",
    numeric: false,
    disablePadding: true,
    label: "時間枠",
    width: "10%",
  },
  {
    id: "projectName",
    numeric: false,
    disablePadding: true,
    label: "案件名",
    width: "20%",
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            style={{ width: headCell.width }}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            <span style={{ fontWeight: "bold" }}>{headCell.label}</span>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

export default UnapprovedList;
