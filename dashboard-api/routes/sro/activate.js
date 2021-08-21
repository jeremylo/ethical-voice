import Router from 'express';
import jwt from 'jsonwebtoken';
import { createSro } from '../../persistence/sros.js';
import { hashPassword, isValidEmail, isValidName, isValidPassword } from '../../utils.js';

const router = Router();

/**
 * Handles an SRO activating their account and providing additionally required information.
 */
router.post('/', async (req, res) => {
    if (!req.body.token || typeof req.body.token !== "string" || req.body.token.length < 32) {
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    if (!req.body.name || !isValidName(req.body.name)) {
        return res.status(400).json({ error: "The provided name is invalid." });
    }

    if (!req.body.password || !isValidPassword(req.body.password)) {
        return res.status(400).json({ error: "The provided password is invalid." });
    }

    let decoded;
    try {
        decoded = jwt.verify(String(req.body.token), process.env.JWT_SECRET);

        if (!decoded.email || !isValidEmail(decoded.email)
            || decoded.trusted === undefined || typeof decoded.trusted !== "boolean") {
            throw new Error("Bad token.");
        }
    } catch (e) {
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    try {
        await createSro(
            req.body.name.replace(/\s+/g, ' ').trim(),
            decoded.email.toLowerCase(),
            hashPassword(req.body.password),
            decoded.trusted
        );
        return res.status(200).json({ message: "SRO account activation successful." });
    } catch (e) {
        return res.status(500).json({ message: "SRO account activation failure." });
    }
});

export default router;
