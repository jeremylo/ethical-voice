import Router from 'express';
import { fetchSubmissionDataByUser } from '../persistence/submissions.js';
import { findUserById, updateUserExtra } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';
import { isNumeric } from '../utils.js';


const router = Router();

router.get('/:id/submissions', requireAuth, async (req, res) => {
    if (!req.params.id || !isNumeric(req.params.id) || +req.params.id <= 0) {
        return res.status(400).json({
            error: "Apologies - we couldn't make out what you're asking for."
        });
    }

    try {
        const user = await findUserById(+req.params.id)
        if (user.sro_id !== req.user.id) {
            return res.status(401).json({
                error: "You are not authorised to do this."
            })
        }

        const submissionsData = {};

        const [submissions, metadata] = await fetchSubmissionDataByUser(user.id, false);
        for (const submission of submissions) {
            submissionsData[submission.submission_id] = { ...submission, metadata: {} };
        }

        for (const metadatum of metadata) {
            submissionsData[metadatum.submission_id].metadata[metadatum.metadata_key] = metadatum.metadata_value;
        }

        return res.status(200).json({ submissionsData: Object.values(submissionsData) });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: "This action could not be performed."
        })
    }
})

router.post('/extra', requireAuth, async (req, res) => {
    if (!req.body.id || !isNumeric(req.body.id) || +req.body.id <= 0
        || req.body.extra === undefined || typeof req.body.extra !== "string" || String(req.body.extra).length >= 255) {
        return res.status(400).json({
            error: "Apologies - we couldn't make out what you're asking for."
        });
    }

    try {
        const user = await findUserById(+req.body.id)
        await updateUserExtra(user, req.body.extra);
        return res.status(200).json({
            message: "This action was successful."
        })
    } catch (e) {
        return res.status(400).json({
            error: "This action could not be performed."
        })
    }
});

export default router;
