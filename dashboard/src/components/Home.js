import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/use-auth';
import AggregateSubmissionGraphs from './graphs/AggregateSubmissionGraphs';

export default function Home() {
    const auth = useAuth();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = _ => {
        fetch('/api/submissions')
            .then(async (res) => await res.json())
            .then(res => {
                setSubmissions(res.submissionsData);
            })
            .catch(console.error)
            .finally(_ => {
                setLoading(false);
            });
    }

    useEffect(refresh, [setSubmissions]);



    return (<>
        <Typography variant="h4">Hello, {auth.sro.name}</Typography>
        <Typography variant="h5">Aggregate submission data</Typography>
        <br />
        {!loading && <AggregateSubmissionGraphs submissions={submissions} />}
    </>);
}
