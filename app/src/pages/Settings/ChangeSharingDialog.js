import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
    paper: {
        width: '100%',
    },
});

export default function ChangeSharingDialog(props) {
    const classes = useStyles();

    const { onClose, open } = props;
    const [value, setValue] = React.useState(props.value);

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(value);
    };

    const handleChange = (event) => {
        setValue(!value);
    };

    return (
        <Dialog
            aria-labelledby="sharing-update-dialog-title"
            open={open}
            onClose={handleCancel}
            keepMounted
            className={classes.paper}
        >
            <DialogTitle id="sharing-update-dialog-title">Update your sharing preferences</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select whether or not you would like to share future submissions with your senior responsible officer below.
                </DialogContentText>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={value}
                            onChange={handleChange}
                            name="sharing-checkbox"
                            color="primary"
                        />
                    }
                    label="Share future submissions"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
