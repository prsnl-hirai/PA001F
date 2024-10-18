import { useState, useEffect, useRef, FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

/**
 * 確認ダイアログ
 */
const ComfirmDialog = (props) => {
  const { isShow, setIsShow, message, onClickOk } = props;
  const [isShowDialog, setIsShowDialog] = useState(false);

  useEffect(() => {
    setIsShowDialog(isShow);
  }, [isShow]);

  return (
    <div>
      <Dialog
        open={isShowDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsShowDialog(false);
              setIsShow(false);
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
              setIsShowDialog(false);
              setIsShow(false);
              onClickOk();
            }}
          >
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ComfirmDialog;
