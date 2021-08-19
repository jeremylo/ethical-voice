import Router from 'express';
import { findActivatedUsersBySro, findUserById, updateUserExtra } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';
import { isNumeric } from '../utils.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const patients = await findActivatedUsersBySro(req.user.id);
        return res.status(200).json({
            patients: patients.map(({ id, reference_id, email, outward_postcode, created_at, updated_at, extra }) => ({
                id,
                referenceId: reference_id,
                email,
                outwardPostcode: outward_postcode,
                createdAt: created_at,
                updatedAt: updated_at,
                extra: extra ?? ''
            }))
        })
    } catch (e) {
        return res.status(500).json({
            error: "Patients could not be retrieved."
        })
    }
});

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
})

export default router;
