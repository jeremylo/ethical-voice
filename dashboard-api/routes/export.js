import AdmZip from 'adm-zip';
import Router from 'express';
import { fetchSubmissionData } from '../persistence/submissions.js';
import requireAuth from '../requireAuth.js';

const router = Router();

/**
 * Generates a ZIP archive containing all of the submission data, metadata
 * and submission audio files (if present) associated with the logged-in
 * SRO's patients and sends the archive to the user's browser for download.
 *
 * There is a submissions.json file containing the submission data and metadata
 * (flattened into a single row for easy conversion to say, CSV, for example).
 *
 * Audio files are named submission_ID.wav where ID is the submission ID.
 *
 * Audio files are 16kHz 16-bit signed integer PCM encoded WAV files.
 */
router.get('/', requireAuth, async (req, res) => {
    const submissionData = {};
    try {
        const [submissions, metadata] = await fetchSubmissionData(req.user.id);
        const directoryName = `export-${new Date().toISOString().slice(0, 10)}`;
        const zip = new AdmZip();
        for (const submission of submissions) {
            const { audio, ...submissionDatum } = submission;
            submissionData[submission.submission_id] = submissionDatum;
            if (audio) {
                zip.addFile(`${directoryName}/submission_${submission.submission_id}.wav`, audio);
            }
        }

        for (const metadatum of metadata) {
            submissionData[metadatum.submission_id][metadatum.metadata_key] = metadatum.metadata_value;
        }
        zip.addFile(`${directoryName}/submissions.json`, Buffer.from(JSON.stringify(Object.values(submissionData))));

        res
            .set('Content-Disposition', `attachment; filename="${directoryName}.zip"`)
            .status(200)
            .send(zip.toBuffer());
    } catch {
        return res.status(500).send('Awfully sorry - there was an error exporting the data!');
    }
});

export default router;
