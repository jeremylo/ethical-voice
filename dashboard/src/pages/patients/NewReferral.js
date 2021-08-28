import { Button, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useState } from 'react';


export default function NewReferral() {
    const [newRefId, setNewRefId] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [extra, setExtra] = useState('');

    const handleExtraChange = (event) => {
        if (event.target.value.length <= 255)
            setExtra(event.target.value);
    };

    const generateNewReferral = () => {
        setGenerating(true);

        fetch('/api/referral', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ extra })
        })
            .then(res => res.json())
            .then(res => {
                if (res.referenceId) {
                    setNewRefId(res.referenceId);
                    setGenerating(false);
                }
            })
            .catch(console.error);
    }

    const link = newRefId ? `https://${process.env.REACT_APP_APP_DOMAIN}/register/${newRefId}` : '';

    return (<>
        <Typography variant="h5">Refer a new patient</Typography>
        <Typography>
            To refer a new patient to the service, please generate a new reference ID below; this will be required for the patient to register for the app.

            <br /><br />

            You may optionally attach any additional notes to be associated with the reference ID you are to generate. You may use this 255-character field however you see fit, e.g. for additional identifiers or short notes.
        </Typography>
        {newRefId && !generating && <Alert severity="success">
            <AlertTitle>New reference ID generated successfully</AlertTitle>
            Please give the reference ID below to the patient you are referring to this service; they will require it to register with the application.
            <br />
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
            <br /><br />
            A direct link to the registration page has been generated for the patient's convenience, but there is no obligation to use this; the patient may also type the reference ID in manually.
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

        <TextField
            label="Extra notes or information"
            placeholder=""
            margin="normal"
            variant="outlined"
            value={extra}
            onChange={handleExtraChange}
            multiline
            style={{ maxWidth: '30vw', width: '100%' }}
        />
        <br />
        <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={generateNewReferral}
            disabled={generating}
            style={{ maxWidth: '30vw', width: '100%' }}
        >
            Generate new reference ID
        </Button>
    </>);
}
