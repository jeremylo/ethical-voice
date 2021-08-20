import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TimeGraphs from './graphs/TimeGraphs';
import { isNumeric, useForceLogin } from './utils';

export default function Patient() {
    useForceLogin();

    const params = useParams();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const refresh = _ => {
        fetch(`/api/patient/${params.id}/submissions`)
            .then(async (res) => await res.json())
            .then(res => {
                setSubmissions(res.submissionsData);
            })
            .catch(console.error)
            .finally(_ => {
                setLoading(false);
            });
    }

    useEffect(refresh, [setSubmissions, params.id]);

    if (!isNumeric(params.id) || +params.id <= 0) {
        return <div>
            Error.
        </div>;
    }

    if (loading) {
        return <div>Please wait.</div>;
    }



    return (<>
        <Typography variant="h4">Patient submission visualisations</Typography>
        <TimeGraphs submissions={submissions} />
    </>);
}
