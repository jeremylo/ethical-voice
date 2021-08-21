import Router from 'express';
import { createUnactivatedUser, findUnactivatedUsersBySro, findUserById, updateUserExtra } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';
import { generateReferenceId, isNumeric } from '../utils.js';


const router = Router();

/**
 * Responds with all currently open patient referrals.
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const referrals = await findUnactivatedUsersBySro(req.user.id);
        return res.status(200).json({
            referrals: referrals.map(({ id, reference_id, created_at, extra }) => ({
                id, referenceId: reference_id, createdAt: created_at, extra
            }))
        })
    } catch (e) {
        return res.status(500).json({
            error: "Unactivated referrals could not be retrieved."
        })
    }
});

/**
 * Generates a new referral ID (and optionally associates any extra information
 * the SRO wishes to include as a part of the patient's record with said referral ID).
 */
router.post('/', requireAuth, async (req, res) => {
    try {
        const referenceId = generateReferenceId();
        await createUnactivatedUser(
            referenceId,
            req.user.id,
            req.body.extra && typeof req.body.extra === 'string' && req.body.extra.length <= 255 ? req.body.extra : null
        );
        return res.status(200).json({ referenceId });
    } catch (e) {
        return res.status(500).json({ error: "A new reference ID could not be generated." });
    }
});

/**
 * Handles an SRO updating the 'extra' information field of an unactivated patient.
 */
router.post('/extra', requireAuth, async (req, res) => {
    if (!req.body.id || !isNumeric(req.body.id) || +req.body.id <= 0
        || req.body.extra === undefined || typeof req.body.extra !== "string" || String(req.body.extra).length >= 255) {
        return res.status(400).json({
            error: "Apologies - we couldn't make out what you're asking for."
        });
    }

    try {
        const user = await findUserById(+req.body.id, 0)
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
