import { Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';


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

const patientData = [
    { id: 1, referenceId: '001', email: 'a@example.com', outwardPostcode: 'N7', createdAt: "2021-08-10", updatedAt: "2021-08-15" },
    { id: 2, referenceId: '002', email: 'b@example.com', outwardPostcode: 'N8', createdAt: "2021-08-10", updatedAt: "2021-08-15" },
    { id: 3, referenceId: '003', email: 'c@example.com', outwardPostcode: 'N5', createdAt: "2021-08-11", updatedAt: "2021-08-15" },
    { id: 4, referenceId: '004', email: 'e@example.com', outwardPostcode: 'N6', createdAt: "2021-08-12", updatedAt: "2021-08-15" },
    { id: 5, referenceId: '005', email: 'f@example.com', outwardPostcode: 'N4', createdAt: "2021-08-13", updatedAt: "2021-08-15" },
];

function RegisteredPatients() {
    if (patientData.length < 1) {
        return <Typography>
            It appears you have yet to refer any patients to this service. When you do so and they have activated their accounts, they will appear here.
        </Typography>;
    }

    return <div style={{ height: '70vh', width: '100%' }}>
        <DataGrid
            rows={patientData}
            columns={columns}
            disableSelectionOnClick
        />
    </div>;
}

export default function Patients() {

    return (<>
        <Typography variant="h4">My patients</Typography>
        <Typography variant="h5">Registered patients</Typography>
        <RegisteredPatients />
    </>);
}
