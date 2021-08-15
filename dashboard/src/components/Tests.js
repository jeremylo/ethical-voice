import { Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import TestsTable from './table/TestsTable';

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
    console.log(tests);

    return (<>
        <Typography variant="h4">Speaking test types</Typography>
        <br />
        <Alert severity="info">
            To preserve the original test description for any submission, test types may not be modified or deleted - only disabled with a new test type created to supplant it.
        </Alert>
        <br />
        <TestsTable rows={tests} headCells={headCells} />
    </>);
}
