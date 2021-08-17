import Router from 'express';
import { findActivatedSros } from '../persistence/sros.js';
import requireAuth from '../requireAuth.js';


const router = Router();

router.get('/', requireAuth, async (req, res) => {
    if (req.user.trusted !== 1) {
        return res.status(401).json({ error: "Access denied." });
    }

    try {
        const sros = await findActivatedSros();
        return res.status(200).json({
            sros: sros.map(({ id, name, email, trusted, created_at, updated_at }) => ({
                id,
                name,
                email,
                trusted: trusted === 1,
                createdAt: created_at,
                updatedAt: updated_at,
            }))
        })
    } catch (e) {
        return res.status(500).json({
            error: "SROs could not be retrieved."
        })
    }
});

export default router;
