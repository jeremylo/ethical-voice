import Router from 'express';
import { findActivatedUsersBySro } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';


const router = Router();

/**
 * Responds with all patients associated with the currently logged-in SRO.
 */
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

export default router;
