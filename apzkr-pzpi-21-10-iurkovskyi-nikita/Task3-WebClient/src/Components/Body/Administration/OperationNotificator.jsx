import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";

const OperationNotificator = (props) => {
    return(
        <Dialog
            open={props.open}
            onClose={props.closeNotificationBar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.message}</DialogTitle>
            <DialogActions>
                <Button onClick={props.closeNotificationBar} color="primary" autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default OperationNotificator;