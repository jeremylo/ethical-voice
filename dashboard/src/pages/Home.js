import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/use-auth';
import AggregateSubmissionGraphs from '../components/Graphs/AggregateSubmissionGraphs';
import SubmissionDistributions from '../components/Graphs/SubmissionDistributions';

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
        {!loading && (submissions.length > 2 ? <>
            <Typography variant="h5">Submission metadata vs syllable rate graphs</Typography>
            <br />
            <AggregateSubmissionGraphs submissions={submissions} />
            <br />
            <Typography variant="h5">Aggregate submission metadata distributions</Typography>
            <br />
            <SubmissionDistributions submissions={submissions} />
        </> : <Typography>
            <br />
            When there are at least three submissions, they will be visualised here.
        </Typography>)}

    </>);
}
