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
            It appears you have yet to refer any patients to this service. When you do so and they have activated their accounts, they will appear here.
        </Typography></Paper>}
    </>);
}
