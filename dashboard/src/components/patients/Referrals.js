import { Paper, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
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
            />
        </div> : <Paper style={{ padding: '1rem' }}><Typography>
            You do not have any open referrals that have yet to be claimed by patients.
        </Typography></Paper>}
    </>);
}
