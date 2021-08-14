import { Button, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useState } from 'react';


export default function NewReferral() {
    const [newRefId, setNewRefId] = useState(null);

    const generateNewReferral = () => {
        setNewRefId('000000000001');
    }

    const link = newRefId ? `https://mydata.jezz.me/register/${newRefId}` : '';

    return (<>
        <Typography variant="h5">Refer a new patient</Typography>
        <Typography>
            To refer a new patient to the service, you must first generate a <strong>reference ID</strong> that will be required when the patient registers for the <em>My Data</em> app.
        </Typography>
        {newRefId && <Alert severity="success">
            <AlertTitle>New reference ID generated successfully</AlertTitle>
            Please give the reference ID below to the patient you are referring to this service; they will require it to register with the application. A direct link to the registration page has been provided for the patient's convenience.
            <br /><br />
            <TextField
                label="Reference ID"
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
            <br />
            <TextField
                label="Referral link"
                placeholder=""
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <Tooltip title="Copy to clipboard">
                            <IconButton onClick={_ => { navigator.clipboard.writeText(link) }}>
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
                value={link}
            />
        </Alert>}
        <br />
        <Button variant="contained" size="large" color="primary" onClick={generateNewReferral}>
            Generate new reference ID
        </Button>
    </>);
}
