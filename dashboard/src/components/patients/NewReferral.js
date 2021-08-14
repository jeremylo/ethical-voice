import { Button, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useState } from 'react';


export default function NewReferral() {
    const [newRefId, setNewRefId] = useState(null);

    const generateNewReferal = () => {
        setNewRefId('000000000001');
    }

    return (<>
        <Typography variant="h5">Refer a new patient</Typography>
        {newRefId && <Alert severity="success">
            <AlertTitle>New reference ID generated successfully</AlertTitle>
            Please give the reference ID below to the patient you are referring to this service. They will require it to register with the application.
            <br /><br />
            <TextField
                id="outlined-full-width"
                label="Reference ID"
                style={{ margin: 8 }}
                placeholder=""
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <Tooltip title="Copy to clipboard">
                            <IconButton onClick={_ => { navigator.clipboard.writeText(newRefId) }}>
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>,
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                //disabled
                value={newRefId}
            />
        </Alert>}
        <br />
        <Button variant="contained" size="large" color="primary" onClick={generateNewReferal}>
            Generate new reference ID
        </Button>
    </>);
}
