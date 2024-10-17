import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
  })
);

/**
 * 未申請タブ
 */
const UnappliedList = (props) => {
  const classes = useStyles();
  const { dispYear, dispMonth, dispData } = props;

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
      <TableContainer>
        <Table
          className={classes.table}
          stickyHeader
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="enhanced table"
        >
          <EnhancedTableHead classes={classes} />
          <TableBody>
            {dispData.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  // role="checkbox"
                  // aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  // selected={isItemSelected}
                >
                  <TableCell
                    padding="checkbox"
                    style={{ height: "63.75px" }}
                  ></TableCell>
                  <TableCell component="th" id={labelId} padding="none">
                    {row.userId}
                  </TableCell>
                  <TableCell scope="row" padding="none">
                    {row.name}
                  </TableCell>
                  <TableCell></TableCell>
                  {/* <TableCell padding="default" align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    // className={classes.button}
                    // startIcon={<SaveIcon />}
                    // onClick={() => {
                    //   navigate("/atndAdmin/unapproved", {
                    //     state: {
                    //       user: row.userId,
                    //       name: row.name,
                    //       year: row.year,
                    //       month: row.month,
                    //     },
                    //   });
                    // }}
                  >
                    参照
                  </Button>
                </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
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
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" style={{ height: "43px" }}></TableCell>
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

export default UnappliedList;
