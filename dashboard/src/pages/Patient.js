import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TimeGraphs from '../components/Graphs/TimeGraphs';
import useForceLogin from '../hooks/useForceLogin';
import { isNumeric } from '../utils/validation';

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
        return <Typography>Please wait.</Typography>;
    }



    return (<>
        <Typography variant="h4">Patient submission visualisations</Typography>
        {submissions.length > 0 ?
            <TimeGraphs submissions={submissions} />
            :
            <Typography>
                There are no results to display.
            </Typography>
        }
    </>);
}
