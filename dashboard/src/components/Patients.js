import { Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';


const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, hide: true },
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
    const [patients, setPatients] = useState([]);

    useEffect(_ => {
        fetch('/api/patients')
            .then(res => res.json())
            .then(res => {
                if (res.patients) {
                    setPatients(res.patients);
                }
            })
            .catch(console.error);
    }, [setPatients]);

    if (patients.length < 1) {
        return <Typography>
            It appears you have yet to refer any patients to this service. When you do so and they have activated their accounts, they will appear here.
        </Typography>;
    }

    return <div style={{ height: '70vh', width: '100%', marginTop: '1rem' }}>
        <DataGrid
            rows={patients}
            columns={columns}
            disableSelectionOnClick
        />
    </div>;
}

export default function Patients() {

    return (<>
        <Typography variant="h4">My patients</Typography>
        <RegisteredPatients />
    </>);
}
