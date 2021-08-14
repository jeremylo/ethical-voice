import Router from 'express';
import { findActivatedUsersBySro } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const patients = await findActivatedUsersBySro(req.user.id);
        return res.status(200).json({
            patients: patients.map(({ id, reference_id, email, outward_postcode, created_at, updated_at }) => ({
                id,
                referenceId: reference_id,
                email,
                outwardPostcode: outward_postcode,
                createdAt: created_at,
                updatedAt: updated_at,
            }))
        })
    } catch (e) {
        return res.status(500).json({
            error: "Patients could not be retrieved."
        })
    }
});

export default router;
