import { Paper, Snackbar, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import Alert from '@material-ui/lab/Alert';
import { useCallback, useEffect, useState } from 'react';
import CustomToolbar from './CustomToolbar';

const columns = [
    { field: 'referenceId', headerName: 'Reference ID', flex: 0.5 },
    {
        field: 'createdAt', headerName: 'Referral date', flex: 0.5,
        valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    { field: 'extra', headerName: 'Extra notes', flex: 0.8, editable: true },
];

export default function Referrals() {
    const [referrals, setReferrals] = useState([]);

    useEffect(_ => {
        fetch('/api/referral')
            .then(res => res.json())
            .then(res => {
                if (res.referrals) {
                    setReferrals(res.referrals);
                }
            })
            .catch(console.error);
    }, [setReferrals]);

    const [open, setOpen] = useState(false);
    const [snackbarProperties, setSnackbarProperties] = useState({
        severity: "success",
        message: "Success!"
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleCellEditCommit = useCallback(
        ({ id, field, value }) => {
            if (field === 'extra') {
                if (value.length > 255) {
                    setSnackbarProperties({
                        severity: 'error',
                        message: 'This field is too long.'
                    });
                    setOpen(true);
                    return;
                }

                const updatedReferrals = referrals.map((row) => {
                    return row.id === id ? { ...row, extra: value } : row;
                });

                fetch('/api/referral/extra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id, extra: value })
                })
                    .then(res => {
                        if (res.status !== 200) throw new Error("Bad request.");
                        return res.json();
                    })
                    .then(res => {
                        setReferrals(updatedReferrals);
                        setSnackbarProperties({
                            severity: 'success',
                            message: 'Field updated successfully.'
                        });
                        setOpen(true);
                    })
                    .catch(e => {
                        setSnackbarProperties({
                            severity: 'error',
                            message: 'Apologies - this field could not be updated.'
                        });
                        setOpen(true);
                    })
            }
        },
        [referrals],
    );

    return (<>
        <Typography variant="h5">Open Referrals</Typography>
        <Typography>
            All reference IDs you have generated that remain unregistered by patients are listed below.
        </Typography>
        <br />
        {referrals.length > 0 ? <div style={{ height: '50vh', width: '100%' }}>
            <DataGrid
                rows={referrals}
                columns={columns}
                disableSelectionOnClick
                components={{
                    Toolbar: CustomToolbar,
                }}
                onCellEditCommit={handleCellEditCommit}
            />

            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarProperties.severity}>{snackbarProperties.message}</Alert>
            </Snackbar>
        </div> : <Paper style={{ padding: '1rem' }}><Typography>
            You do not have any open referrals that have yet to be claimed by patients.
        </Typography></Paper>}
    </>);
}
