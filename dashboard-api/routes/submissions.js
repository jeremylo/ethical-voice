import Router from 'express';
import { fetchSubmissionData } from '../persistence/submissions.js';
import requireAuth from '../requireAuth.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    const submissionsData = {};
    try {
        const [submissions, metadata] = await fetchSubmissionData(req.user.id, false);
        for (const submission of submissions) {
            submissionsData[submission.submission_id] = { ...submission, metadata: {} };
        }

        for (const metadatum of metadata) {
            submissionsData[metadatum.submission_id].metadata[metadatum.metadata_key] = metadatum.metadata_value;
        }

        return res.status(200).json({ submissionsData: Object.values(submissionsData) });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: 'Awfully sorry - there was an error fetching the data!'
        });
    }
});

export default router;
