import { Typography } from '@material-ui/core';
import {
    DataGrid
} from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import CustomToolbar from './patients/CustomToolbar';


const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, hide: true },
    { field: 'title', headerName: 'Title', flex: 0.8 },
    { field: 'instruction', headerName: 'Instruction', flex: 1.5 },
    {
        field: 'possibleDurations', headerName: 'Possible durations', flex: 1,
        valueFormatter: (params) => JSON.stringify(params.value).slice(1, -1)
    },
    {
        field: 'active', headerName: 'Enabled', flex: 0.5, type: 'boolean',
        valueFormatter: (params) => params.value ? 1 : 0
    },
];

export default function Tests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(_ => {
        fetch('/api/tests')
            .then(async (res) => await res.json())
            .then(res => {
                setTests(Object.values(res));
            })
            .catch(console.error)
            .finally(_ => {
                setLoading(false);
            });
    }, [setTests]);

    return (<>
        <Typography variant="h4">Speaking tests</Typography>
        <div style={{ height: '70vh', width: '100%', marginTop: '1rem' }}>
            <DataGrid
                rows={tests}
                columns={columns}
                disableSelectionOnClick
                loading={loading}
                components={{
                    Toolbar: CustomToolbar,
                }}
            />
        </div>
    </>);
}
