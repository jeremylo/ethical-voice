import AdmZip from 'adm-zip';
import Router from 'express';
import { fetchSubmissionData } from '../persistence/submissions.js';
import requireAuth from '../requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
    const submissionData = {};
    try {
        const [submissions, metadata] = await fetchSubmissionData(req.user.id);
        const directoryName = `export-${new Date().toISOString().slice(0, 10)}`;
        const zip = new AdmZip();
        for (const submission of submissions) {
            const { audio, ...submissionDatum } = submission;
            submissionData[submission.submission_id] = submissionDatum;
            zip.addFile(`${directoryName}/submission_${submission.submission_id}.wav`, audio);
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
