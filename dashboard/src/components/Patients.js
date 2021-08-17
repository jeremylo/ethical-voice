import { Typography } from '@material-ui/core';
import {
    DataGrid
} from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import CustomToolbar from './patients/CustomToolbar';
import { useForceLogin } from './utils';

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

    return <div style={{ height: '70vh', width: '100%', marginTop: '1rem' }}>
        <DataGrid
            rows={patients}
            columns={columns}
            disableSelectionOnClick
            loading={loading}
            components={{
                Toolbar: CustomToolbar,
            }}
        />
    </div>;
}

export default function Patients() {
    return (<>
        <Typography variant="h4">My patients</Typography>
        <RegisteredPatients />
    </>);
}
