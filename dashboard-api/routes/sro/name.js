import Router from 'express';
import { updateSroName } from '../../persistence/sros.js';
import requireAuth from '../../requireAuth.js';
import { isValidName } from '../../utils.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (!req.body.name || !isValidName(req.body.name)) {
        return res.status(400).json({ "error": "Sorry, this name is not acceptable." });
    }

    try {
        await updateSroName(req.user, req.body.name.replace(/\s+/g, ' ').trim());
        return res.status(200).json({ message: "The name was updated successfully." });
    } catch (e) {
        return res.status(500).json({ message: "The name could not be updated successfully." });
    }
});

export default router;
