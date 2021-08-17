import Router from 'express';
import { transferPatients } from '../../persistence/sros.js';
import requireAuth from '../../requireAuth.js';
import { isNumeric } from '../../utils.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (req.user.trusted !== 1) {
        return res.status(401).json({ error: "Not authorised." });
    }

    if (!req.body.from_id || !isNumeric(req.body.from_id || +req.body.from_id <= 0)
        || !req.body.to_id || !isNumeric(req.body.to_id) || +req.body.to_id <= 0) {
        return res.status(400).json({ "error": "Bad input." });
    }

    try {
        await transferPatients(req.body.from_id, req.body.to_id);

        return res.status(200).json({ message: "Transfer successful." });
    } catch (e) {
        return res.status(500).json({ message: "Transfer unsuccessful." });
    }
});

export default router;
