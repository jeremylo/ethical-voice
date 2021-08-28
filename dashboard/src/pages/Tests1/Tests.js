import { Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import CreateTest from './CreateTest';
import TestsTable from './TestsTable';

const headCells = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'instruction', label: 'Instruction' },
    { id: 'possibleDurations', label: 'Possible durations (sec)' },
    { id: 'active', label: 'Enabled' },
];

export default function Tests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = _ => {
        fetch('/api/tests')
            .then(async (res) => await res.json())
            .then(res => {
                setTests(Object.values(res));
            })
            .catch(console.error)
            .finally(_ => {
                setLoading(false);
            });
    }

    useEffect(refresh, [setTests]);

    return (<>
        <Typography variant="h4">Speaking test types</Typography>
        <Typography variant="h5">Existing test types</Typography>
        <br />
        <Alert severity="info">
            To preserve the original test description for any submission, test types may not be modified or deleted - only disabled with a new test type created to supplant it.
        </Alert>
        <br />
        {!loading && <TestsTable rows={tests} headCells={headCells} refresh={refresh} />}
        <Typography variant="h5">Create a new test type</Typography>
        <CreateTest refresh={refresh} />
        <br /><br /><br /><br /><br /><br /><br />
    </>);
}
