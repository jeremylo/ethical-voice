import Router from 'express';
import { fetchSubmissionAudioByIdAndSro, fetchSubmissionData } from '../persistence/submissions.js';
import requireAuth from '../requireAuth.js';
import { isNumeric } from '../utils.js';


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
        return res.status(500).json({
            error: 'Awfully sorry - there was an error fetching the data!'
        });
    }
});

router.get('/audio/:id', requireAuth, async (req, res) => {
    if (!req.params.id || !isNumeric(req.params.id) || +req.params.id <= 0) {
        return res.status(400).json({
            error: "Apologies - we couldn't make out what you're asking for."
        });
    }

    try {
        const submission = await fetchSubmissionAudioByIdAndSro(+req.params.id, req.user.id);
        return res.set('Content-Type', 'audio/wav').status(200).send(submission.audio);
    } catch (e) {
        return res.status(500).json({
            error: "Apologies - we couldn't fetch that submission."
        });
    }
});

export default router;
