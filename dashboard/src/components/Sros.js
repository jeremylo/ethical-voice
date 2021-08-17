import { Typography } from '@material-ui/core';
import {
    DataGrid
} from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import CustomToolbar from './patients/CustomToolbar';


const columns = [
    { field: 'id', headerName: 'ID', flex: 0.4 },
    { field: 'name', headerName: 'Name', flex: 0.8 },
    { field: 'email', headerName: 'Email', flex: 0.8 },
    { field: 'trusted', headerName: 'Trusted', flex: 0.4, type: 'boolean' },
    {
        field: 'createdAt', headerName: 'Referral date', flex: 0.5,
        valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
        field: 'updatedAt', headerName: 'Last update', flex: 0.5,
        valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
];

function RegisteredSros() {
    const [sros, setSros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(_ => {
        fetch('/api/sros')
            .then(res => res.json())
            .then(res => {
                if (res.sros) {
                    setSros(res.sros);
                }
            })
            .catch(console.error)
            .finally(_ => {
                setLoading(false);
            });
    }, [setSros]);

    return <div style={{ height: '70vh', width: '100%', marginTop: '1rem' }}>
        <DataGrid
            rows={sros}
            columns={columns}
            disableSelectionOnClick
            loading={loading}
            components={{
                Toolbar: CustomToolbar,
            }}
        />
    </div>;
}

export default function Sros() {
    return (<>
        <Typography variant="h4">Senior responsible officers</Typography>
        <Typography variant="h5">Registered senior responsible officers</Typography>
        <RegisteredSros />
        <br />
        <Typography variant="h5">Invite new senior responsible officer</Typography>
        <br />
        <Typography variant="h5">Transfer patients</Typography>
    </>);
}
