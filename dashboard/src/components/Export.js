import { Breadcrumbs, Button, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export default function Export() {
    return (<>
        <Typography variant="h4">Export submission data</Typography>
        <br />
        <Alert severity="info">
            If you have specific data format requirements beyond the capabilities of this export tool, please speak with your system administrator about exporting directly from the database.
        </Alert>
        <br />
        <Typography>
            To download all of the audio submissions your patients have shared with you to date, along with supporting metadata, press the button below.
        </Typography>
        <br />
        <Button href="/api/export" variant="contained" color="primary" size="large">Export & download</Button>
        <br />
        <br />
        <Typography variant="h5">Export format</Typography>
        <Typography>
            This tool produces a zip file containing the following:
            <ul>
                <li>a JSON file containing an array of submission metadata called <strong><code>submissions.json</code></strong>; and</li>
                <li>WAV files of patients' audio submissions named <strong><code>submission_ID.wav</code></strong>, where
                    <ul>
                        <li>"ID" is the identifier of a submission detailed in <code>submissions.json</code>, and</li>
                        <li>Each audio file is encoded as a 16kHz 16-bit signed integer PCM WAV file.</li>
                    </ul></li>
            </ul>
        </Typography>
        <Typography variant="h6">Example</Typography>
        <Typography>
            As an example, an exported zip file of a single submission may contain an <code>submission_1.wav</code> audio file and a <code>submissions.json</code> file with the following contents:
            <br />
            <pre style={{ marginLeft: '4rem' }}><code>
                [ {'{'} <br />
                <div style={{ marginLeft: '4rem' }}>
                    "submission_id": 1, <br />
                    "reference_id": "000000000001", <br />
                    "outward_postcode": "SW1", <br />
                    "test_type_id": 1, <br />
                    "created_at": "2021-08-16T14:15:32.585Z", <br />
                    "received_at": "2021-08-16T14:19:07.766Z", <br />
                    "extra": "Additional information tied to this user supplied by their SRO.", <br />
                    "speech.syllableCount": "50", <br />
                    "speech.syllablesPerMinute": "300", <br />
                    "speech.wordCount": "31", <br />
                    "speech.wordsPerMinute": "186", <br />
                    "speech.duration": "10", <br />
                    "speech.transcription": "A record of what was said in the audio clip.", <br />
                    "sputum": "1", <br />
                    "wellbeing": "7", <br />
                    "dyspnoea": "1" <br />
                </div>
                {'}'} ]
            </code></pre>
        </Typography>
        <br />
        <Typography variant="h5">Use with Excel</Typography>
        <Typography>
            While JSON is a useful, human-readable format for analysing the submission data further programmatically, you may wish to inspect the data using Excel. To ingest the submissions.json file into Excel, follow these steps:
        </Typography><br />
        <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Typography color="textPrimary"><strong>Data</strong> (in the ribbon toolbar)</Typography>
            <Typography color="textPrimary"><strong>Get Data</strong> (under 'Get & Transform Data')</Typography>
            <Typography color="textPrimary"><strong>From File</strong></Typography>
            <Typography color="textPrimary"><strong>From JSON</strong></Typography>
            <Typography color="textPrimary"><strong>Into Table</strong></Typography>
            <Typography color="textPrimary"><strong>Expand 'value' column</strong> (double arrow icon)</Typography>
            <Typography color="textPrimary"><strong>Close & Load</strong></Typography>
        </Breadcrumbs>

    </>);
}
