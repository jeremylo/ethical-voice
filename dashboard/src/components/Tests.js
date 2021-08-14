import { Typography } from '@material-ui/core';
import {
    DataGrid
} from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import CustomToolbar from './patients/CustomToolbar';


const columns = [
    { field: 'id', headerName: 'Test ID', flex: 0.5 },
    { field: 'title', headerName: 'Title', flex: 0.8 },
    { field: 'instruction', headerName: 'Instruction', flex: 1.5, editable: true },
    {
        field: 'possibleDurations', headerName: 'Possible durations (sec)', flex: 1,
        valueFormatter: (params) => JSON.stringify(params.value).slice(1, -1)
    },
    {
        field: 'active', headerName: 'Enabled', flex: 0.5, type: 'boolean',
        valueFormatter: (params) => params.value ? 1 : 0,
        editable: true
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
        <Typography variant="h4">Speaking test types</Typography>
        <Typography>
            <strong>Note</strong>: in order to preserve the relationship between submissions and test definitions, test types may not be modified or deleted once created. Instead, create a new test type and disable any test types you do not wish to show patients.
        </Typography>
        <div style={{ height: '70vh', width: '100%', marginTop: '1rem' }}>
            <DataGrid
                rows={tests}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: CustomToolbar,
                }}
            />
        </div>
    </>);
}
