import React, { useState, useEffect, ReactElement } from "react";
import { Document, Page, PDFDownloadLink } from "@react-pdf/renderer";
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

// icon
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import GridOnIcon from "@material-ui/icons/GridOn";

import * as CONST from "../../common/const";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    toolbar: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    title: {
      flex: "1 1 100%",
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
 * 承認済みタブ
 */
const ApprovedList = (props) => {
  const classes = useStyles();
  const { dispYear, dispMonth, dispData } = props;

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

  const createExcel = (e, userId) => {
    e.preventDefault();
    // Workbookの作成
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    // Workbookに新しいWorksheetを追加
    let sheetName = `${dispYear}${dispMonth}`;
    workbook.addWorksheet(sheetName);
    // ↑で追加したWorksheetを参照し変数に代入
    const worksheet = workbook.getWorksheet(sheetName);

    let usersData = dispData.filter((d) => d.userId === userId)[0];

    worksheet.getCell("B2").value = "勤怠管理表";
    worksheet.getCell("B4").value = "年月";
    worksheet.getCell("D4").value = `${dispYear}年${dispMonth}月`;
    worksheet.getCell("J4").value = "社員ID";
    worksheet.getCell("L4").value = userId;
    worksheet.getCell("R4").value = "氏名";
    worksheet.getCell("T4").value = usersData.name;

    worksheet.getCell("B6").value = "出勤日数";
    worksheet.getCell("D6").value = "休日出勤";
    worksheet.getCell("F6").value = `勤務時間`;
    worksheet.getCell("H6").value = "残業時間";
    worksheet.getCell("J6").value = "深夜残業";
    worksheet.getCell("L6").value = "有給";
    worksheet.getCell("N6").value = "交通費";
    worksheet.getCell("P6").value = "超過時間";
    worksheet.getCell("R6").value = "時間枠";
    worksheet.getCell("T6").value = "案件名";

    worksheet.getCell("B7").value = usersData.totalDay;
    worksheet.getCell("D7").value = usersData.holidayWork;
    worksheet.getCell("F7").value = usersData.totalTime;
    worksheet.getCell("H7").value = usersData.over;
    // worksheet.getCell("J7").value = "深夜残業";
    worksheet.getCell("L7").value = usersData.paid;
    worksheet.getCell("N7").value = usersData.transExp;
    worksheet.getCell("P7").value = usersData.excess;
    worksheet.getCell("R7").value = usersData.timeFrame;
    worksheet.getCell("T7").value = usersData.projectName;

    worksheet.getCell("B9").value = "日";
    worksheet.getCell("C9").value = "曜日";
    worksheet.getCell("D9").value = "開始時間";
    worksheet.getCell("F9").value = "終了時間";
    worksheet.getCell("H9").value = "休憩時間";
    worksheet.getCell("J9").value = "勤務時間";
    worksheet.getCell("L9").value = "残業時間";
    worksheet.getCell("N9").value = "深夜勤務";
    worksheet.getCell("P9").value = "有給";
    worksheet.getCell("R9").value = "交通費";
    worksheet.getCell("T9").value = "備考";

    let json = JSON.parse(usersData.data);
    let year = parseInt(dispYear);
    let month = parseInt(dispMonth);

    let blueCells = []; // 青セル
    let redCells = []; //赤セル
    let greenCells = ["B4", "J4", "R4"]; //緑セル
    const paintCols = ["B", "C", "D", "F", "H", "J", "L", "N", "P", "R", "T"];
    paintCols.forEach((col) => {
      greenCells.push(col + "6");
      greenCells.push(col + "9");
    });
    for (let i = 0; i < json.length; i++) {
      let data = json[i];
      let row = 10 + i;
      let weekDay = new Date(year, month - 1, data.day).getDay();
      let weekStr = CONST.DAY_OF_WEEKSTR_JA[weekDay];

      worksheet.getCell("B" + row).value = data.day;
      worksheet.getCell("C" + row).value = weekStr;
      worksheet.getCell("D" + row).value = data.startTime;
      worksheet.getCell("F" + row).value = data.endTime;
      worksheet.getCell("H" + row).value = data.breakTime;
      worksheet.getCell("J" + row).value = data.workTime;
      worksheet.getCell("L" + row).value = data.overTime;
      // worksheet.getCell("N" + row).value = data.overTime;
      worksheet.getCell("P" + row).value = data.paid;
      if (data.transExp > 0 && data.transExp !== "") {
        worksheet.getCell("R" + row).value = parseInt(
          data.transExp
        ).toLocaleString();
      }
      worksheet.getCell("T" + row).value = data.remarks;

      if (data.isHoliday) {
        if (weekDay === 6) {
          paintCols.forEach((col) => {
            blueCells.push(col + row);
            blueCells.push(col + row);
          });
        } else {
          paintCols.forEach((col) => {
            redCells.push(col + row);
            redCells.push(col + row);
          });
        }
      }
    }

    // ワークシートにデフォルトのセルスタイルを設定
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.style = {
          fill: {
            type: "pattern",
            pattern: "none", // パターンをクリアする
            bgColor: { argb: "FFFFFFFF" }, // 背景色を透明にする
          },
          font: {
            color: { argb: "FF000000" }, // デフォルトの文字色 (黒色)
          },
        };
      });
    });

    // 結合したいセルの始点と終点を指定
    const mergeCellRanges = [
      { start: "B4", end: "C4", vertical: "middle", horizontal: "center" },
      { start: "D4", end: "I4", vertical: "middle", horizontal: "center" },
      { start: "J4", end: "K4", vertical: "middle", horizontal: "center" },
      { start: "L4", end: "Q4", vertical: "middle", horizontal: "center" },
      { start: "R4", end: "S4", vertical: "middle", horizontal: "center" },
      { start: "T4", end: "AA4", vertical: "middle", horizontal: "center" },
      { start: "B6", end: "C6", vertical: "middle", horizontal: "center" },
      { start: "D6", end: "E6", vertical: "middle", horizontal: "center" },
      { start: "F6", end: "G6", vertical: "middle", horizontal: "center" },
      { start: "H6", end: "I6", vertical: "middle", horizontal: "center" },
      { start: "J6", end: "K6", vertical: "middle", horizontal: "center" },
      { start: "L6", end: "M6", vertical: "middle", horizontal: "center" },
      { start: "N6", end: "O6", vertical: "middle", horizontal: "center" },
      { start: "P6", end: "Q6", vertical: "middle", horizontal: "center" },
      { start: "R6", end: "S6", vertical: "middle", horizontal: "center" },
      { start: "T6", end: "AA6", vertical: "middle", horizontal: "center" },
      { start: "B7", end: "C7", vertical: "middle", horizontal: "center" },
      { start: "D7", end: "E7", vertical: "middle", horizontal: "center" },
      { start: "F7", end: "G7", vertical: "middle", horizontal: "center" },
      { start: "H7", end: "I7", vertical: "middle", horizontal: "center" },
      { start: "J7", end: "K7", vertical: "middle", horizontal: "center" },
      { start: "L7", end: "M7", vertical: "middle", horizontal: "center" },
      { start: "N7", end: "O7", vertical: "middle", horizontal: "center" },
      { start: "P7", end: "Q7", vertical: "middle", horizontal: "center" },
      { start: "R7", end: "S7", vertical: "middle", horizontal: "center" },
      { start: "T7", end: "AA7", vertical: "middle", horizontal: "center" },
      { start: "B9", end: "B9", vertical: "middle", horizontal: "center" },
      { start: "C9", end: "C9", vertical: "middle", horizontal: "center" },
      { start: "D9", end: "E9", vertical: "middle", horizontal: "center" },
      { start: "F9", end: "G9", vertical: "middle", horizontal: "center" },
      { start: "H9", end: "I9", vertical: "middle", horizontal: "center" },
      { start: "J9", end: "K9", vertical: "middle", horizontal: "center" },
      { start: "L9", end: "M9", vertical: "middle", horizontal: "center" },
      { start: "N9", end: "O9", vertical: "middle", horizontal: "center" },
      { start: "P9", end: "Q9", vertical: "middle", horizontal: "center" },
      { start: "R9", end: "S9", vertical: "middle", horizontal: "center" },
      { start: "T9", end: "AA9", vertical: "middle", horizontal: "center" },
    ];
    for (let i = 0; i < 31; i++) {
      let row = 10 + i;
      mergeCellRanges.push(
        {
          start: "B" + row,
          end: "B" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "C" + row,
          end: "C" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "D" + row,
          end: "E" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "F" + row,
          end: "G" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "H" + row,
          end: "I" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "J" + row,
          end: "K" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "L" + row,
          end: "M" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "N" + row,
          end: "O" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "P" + row,
          end: "Q" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "R" + row,
          end: "S" + row,
          vertical: "middle",
          horizontal: "center",
        },
        {
          start: "T" + row,
          end: "AA" + row,
          vertical: "middle",
          horizontal: "left",
        }
      );
    }
    // 枠線のスタイルを定義
    const borderStyle = {
      style: "thin", // 枠線のスタイル
    };
    // セル結合・枠線設定・フォント設定
    for (const { start, end, vertical, horizontal } of mergeCellRanges) {
      worksheet.mergeCells(start, end);
      worksheet.getCell(start).alignment = {
        vertical: vertical,
        horizontal: horizontal,
      };
      worksheet.getCell(start).border = {
        top: borderStyle,
        left: borderStyle,
        bottom: borderStyle,
        right: borderStyle,
      };
      worksheet.getCell(start).font = {
        name: "Meiryo UI",
        size: 10,
      };
    }

    // シート全体のセルにフォントのスタイルを適用
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = {
          name: "Meiryo UI",
          size: 10,
        };
      });
    });

    // セルの幅を指定
    worksheet.columns.forEach((column) => {
      if (column._number === 1) {
        column.width = 2;
      } else {
        column.width = 4.5;
      }
    });

    // セルの高さを指定
    worksheet.eachRow((row) => {
      row.height = 18.5;
    });

    // タイトルのフォントスタイル変更
    worksheet.getCell("B2").style = {
      font: { name: "Meiryo UI", bold: true, size: 16, underline: true },
      alignment: {
        vertical: "middle",
        horizontal: "left",
      },
    };

    greenCells.forEach((range) => {
      worksheet.getCell(range).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "EBF1DE" },
      };
    });

    blueCells.forEach((range) => {
      worksheet.getCell(range).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DAEEF3" },
      };
    });

    redCells.forEach((range) => {
      worksheet.getCell(range).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F2DCDB" },
      };
    });
    return workbook;
  };

  const outputExcel = async (e, userId) => {
    let workbook = createExcel(e, userId);
    let name = dispData.filter((d) => d.userId === userId)[0].name;
    // UInt8Arrayを生成
    const uint8Array = await workbook.xlsx.writeBuffer();
    // Blob
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}_${dispYear}${dispMonth}.xlsx`;
    a.click();
    // ダウンロード後は不要なのでaタグを除去
    a.remove();
  };

  // ExcelファイルをPDFに変換する関数
  const convertToPDF = async (workbook, name) => {
    // UInt8Arrayを生成
    const uint8Array = await workbook.xlsx.writeBuffer();
    // ExcelファイルをBlobに変換
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    // BlobからData URIを作成
    const url = window.URL.createObjectURL(blob);

    // PDFコンポーネントの生成
    const MyDocument = () => (
      <Document>
        <Page size="A4">
          <iframe title="excel" src={url} width="100%" height="100%" />
        </Page>
      </Document>
    );

    return <MyDocument />;
  };

  const [pdfContent, setPdfContent] = (useState < ReactElement) | (null > null);
  const handleConvertClick = async (workbook, name) => {
    const pdf = await convertToPDF(workbook, name);
    setPdfContent(pdf);
  };

  const bulkOutputExcel = async (e) => {
    const JSZip = require("jszip");
    const zip = new JSZip();
    const excelFiles = [];
    for (let i = 0; i < selectedData.length; i++) {
      let id = selectedData[i];
      let workbook = createExcel(e, id);
      // UInt8Arrayを生成
      const uint8Array = await workbook.xlsx.writeBuffer();
      let name = dispData.filter((d) => d.userId === id)[0].name;
      const filename = `${name}_${dispYear}${dispMonth}.xlsx`;
      excelFiles.push({
        filename: filename,
        data: uint8Array,
      });
    }

    const foldername = `勤怠表${dispYear}${dispMonth}`;
    const folder = zip.folder(foldername);
    excelFiles.forEach((file) => {
      folder.file(file.filename, file.data);
    });

    // JSZipを圧縮してBlobに変換
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9, // 最高圧縮率
      },
    });

    // Blobからダウンロードリンクを生成
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = foldername;
    a.click();
    // ダウンロード後は不要なのでaタグを除去
    a.remove();
  };

  useEffect(() => {
    setSelectedData([]);
  }, [dispYear, dispMonth]);

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
    <Paper className={classes.paper} style={{ height: windowHeight - 210 }}>
      <EnhancedTableToolbar
        selectedData={selectedData}
        bulkOutputExcel={bulkOutputExcel}
      />
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
                  // selectedData={isItemSelected}
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
                  <TableCell padding="default" align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      // className={classes.button}
                      style={{ marginRight: "10px" }}
                      startIcon={<PictureAsPdfIcon />}
                      disabled
                      // onClick={(e) => {
                      //   let workbook = createExcel(
                      //     e,
                      //     row.userId,
                      //     row.name,
                      //     row.data,
                      //     row.totalDay,
                      //     row.holidayWork,
                      //     row.totalTime,
                      //     row.over,
                      //     row.paid,
                      //     row.transExp,
                      //     row.excess,
                      //     row.timeFrame,
                      //     row.projectName
                      //   );
                      //   handleConvertClick(workbook, row.name);
                      // }}
                    >
                      PDF出力
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      // className={classes.button}
                      startIcon={<GridOnIcon />}
                      onClick={(e) => {
                        outputExcel(e, row.userId);
                      }}
                    >
                      EXCEL出力
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {pdfContent && (
        <PDFDownloadLink document={pdfContent} fileName="converted_pdf.pdf">
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download PDF"
          }
        </PDFDownloadLink>
      )} */}
    </Paper>
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

const useToolbarStyles = makeStyles((theme) =>
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
  })
);

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { selectedData, bulkOutputExcel } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: selectedData.length > 0,
      })}
    >
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<PictureAsPdfIcon />}
        // disabled={selectedData.length === 0}
        disabled
        style={{ marginRight: "10px" }}
        // className={classes.button}
        // startIcon={<SaveIcon />}
        // onClick={() => {
        //   setIsShowSaveConfirm(true);
        // }}
      >
        一括PDF出力
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<GridOnIcon />}
        disabled={selectedData.length === 0}
        // className={classes.button}
        // startIcon={<SaveIcon />}
        onClick={bulkOutputExcel}
      >
        一括EXCEL出力
      </Button>
    </Toolbar>
  );
};

export default ApprovedList;
