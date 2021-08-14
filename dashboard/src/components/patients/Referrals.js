import { Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';


const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, hide: true },
    { field: 'referenceId', headerName: 'Reference ID', flex: 0.5 },
    { field: 'createdAt', headerName: 'Referral date', flex: 0.5 },
];

const patientData = [
    { id: 1, referenceId: '001', createdAt: "2021-08-10" },
    { id: 2, referenceId: '002', createdAt: "2021-08-10" },
    { id: 3, referenceId: '003', createdAt: "2021-08-11" },
];

export default function Referrals() {
    return (<>
        <Typography variant="h5">Open Referrals</Typography>
        <Typography>
            All reference IDs you have generated that remain unregistered by patients are listed below.
        </Typography>
        <br />
        {patientData.length > 0 ? <div style={{ height: '50vh', width: '100%' }}>
            <DataGrid
                rows={patientData}
                columns={columns}
                disableSelectionOnClick
            />
        </div> : <Typography>
            It appears you have yet to refer any patients to this service. When you do so and they have activated their accounts, they will appear here.
        </Typography>}
    </>);
}
