import {
    DataGrid
} from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import CustomToolbar from '../../components/CustomToolbar/CustomToolbar';


const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3 },
    { field: 'name', headerName: 'Name', flex: 0.6 },
    { field: 'email', headerName: 'Email', flex: 0.6 },
    { field: 'trusted', headerName: 'Manager', flex: 0.35, type: 'boolean' },
    {
        field: 'createdAt', headerName: 'Referral date', flex: 0.5,
        valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
        field: 'updatedAt', headerName: 'Last update', flex: 0.5,
        valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
];

export default function RegisteredSros() {
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
