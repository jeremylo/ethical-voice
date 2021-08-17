import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import SubmissionsTable from './table/SubmissionsTable';

const headCells = [
    { id: '', label: '' },
    { id: 'submission_id', label: 'Submission ID' },
    { id: 'reference_id', label: 'Reference ID' },
    { id: 'test_type_id', label: 'Test Type ID' },
    { id: 'outward_postcode', label: 'Postcode area' },
    { id: 'created_at', label: 'Creation date' },
    { id: 'received_at', label: 'Submission date' },
];

export default function Submissions() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = _ => {
        fetch('/api/submissions')
            .then(async (res) => await res.json())
            .then(res => {
                setTests(res.submissionsData);
            })
            .catch(console.error)
            .finally(_ => {
                setLoading(false);
            });
    }

    useEffect(refresh, [setTests]);

    return (<>
        <Typography variant="h4">Submissions</Typography>
        <br />
        {!loading && <SubmissionsTable rows={tests} headCells={headCells} refresh={refresh} />}
    </>);
}
