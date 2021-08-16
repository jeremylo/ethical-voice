import AdmZip from 'adm-zip';
import Router from 'express';
import pool from '../db.js';
import requireAuth from '../requireAuth.js';

const router = Router();

async function fetchSubmissionData(sroId) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        await conn.query("CREATE TEMPORARY TABLE export_submissions SELECT submissions.id as submission_id, users.reference_id, submissions.audio, submissions.outward_postcode, submissions.test_type_id, submissions.created_at, submissions.received_at FROM submissions, users WHERE submissions.user_id=users.id AND users.sro_id=?", [sroId]);
        const submissions = await conn.query("SELECT * FROM export_submissions");
        const metadata = await conn.query("SELECT submission_metadata.submission_id, submission_metadata.metadata_key, submission_metadata.metadata_value FROM submission_metadata, export_submissions WHERE submission_metadata.submission_id=export_submissions.submission_id");
        await conn.query("DROP TABLE export_submissions");
        await conn.commit();

        return [submissions, metadata];
    } finally {
        if (conn) conn.release();
    }
}

router.get('/', requireAuth, async (req, res) => {
    const submissionData = {};
    try {
        const [submissions, metadata] = await fetchSubmissionData(req.user.id);
        const zip = new AdmZip();
        for (const submission of submissions) {
            const { audio, ...submissionDatum } = submission;
            submissionData[submission.submission_id] = submissionDatum;
            zip.addFile(`submission_${submission.submission_id}.wav`, audio);
        }

        for (const metadatum of metadata) {
            submissionData[metadatum.submission_id][metadatum.metadata_key] = metadatum.metadata_value;
        }
        zip.addFile('metadata.json', Buffer.from(JSON.stringify(submissionData)));

        res.status(200).send(zip.toBuffer());
    } catch {
        return res.status(500).send('Awfully sorry - there was an error exporting the data!');
    }
});

export default router;
