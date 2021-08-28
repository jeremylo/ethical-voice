import { Button, Snackbar, Typography } from '@material-ui/core';
import {
    DataGrid
} from '@material-ui/data-grid';
import Alert from '@material-ui/lab/Alert';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForceLogin } from '../utils/validation';
import CustomToolbar from './patients/CustomToolbar';

const columns = [
    { field: 'referenceId', headerName: 'Reference ID', flex: 0.5 },
    { field: 'email', headerName: 'Email', flex: 0.8 },
    { field: 'outwardPostcode', headerName: 'Postcode', description: 'Outward postcode', flex: 0.5 },
    {
        field: 'createdAt', headerName: 'Referral date', flex: 0.5,
        valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
        field: 'updatedAt', headerName: 'Last update', flex: 0.5,
        valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    { field: 'extra', headerName: 'Extra notes', flex: 0.8, editable: true },
    {
        field: 'visualisation',
        headerName: 'Visualise submissions',
        flex: 0.8,
        renderCell: (params) => {
            return <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    component={Link}
                    to={`/patient/${params.row.id}`}
                >
                    Visualise submissions
                </Button>
            </strong>
        }
    },
];

function RegisteredPatients() {
    useForceLogin();

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(_ => {
        fetch('/api/patients')
            .then(res => res.json())
            .then(res => {
                if (res.patients) {
                    setPatients(res.patients);
                }
            })
            .catch(console.error)
            .finally(_ => {
                setLoading(false);
            });
    }, [setPatients]);

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

                const updatedPatients = patients.map((row) => {
                    return row.id === id ? { ...row, extra: value } : row;
                });

                fetch('/api/patient/extra', {
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
                        setPatients(updatedPatients);
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
        [patients],
    );

    return <div style={{ height: '70vh', width: '100%', marginTop: '1rem' }}>
        <DataGrid
            rows={patients}
            columns={columns}
            disableSelectionOnClick
            loading={loading}
            components={{
                Toolbar: CustomToolbar,
            }}
            onCellEditCommit={handleCellEditCommit}
        />

        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarProperties.severity}>{snackbarProperties.message}</Alert>
        </Snackbar>
    </div>;
}

export default function Patients() {
    return (<>
        <Typography variant="h4">My patients</Typography>
        <Typography>The patients for whom you are responsible are listed below. You may modify a patient's 'extra notes' field at any time by double-clicking the field, making the change and pressing enter. You may use this extra 255-character field however you see fit, e.g. for additional identifiers or short notes.</Typography>
        <RegisteredPatients />
    </>);
}
