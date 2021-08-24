import Router from 'express';
import jwt from 'jsonwebtoken';
import { activateUser, findUnactivatedUserByReferenceId } from '../../persistence/users.js';
import { hashPassword, hashSha256, isValidEmail, isValidOutwardPostcode, isValidPassword, isValidReferenceId } from '../../utils.js';

const router = Router();

router.post('/', async (req, res) => {
    if (!req.body.referenceId || !isValidReferenceId(req.body.referenceId)) {
        return res.status(400).json({ error: "The provided reference ID is invalid." });
    }

    if (!req.body.token || typeof req.body.token !== "string" || req.body.token.length < 32) {
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    if (!req.body.password || !isValidPassword(req.body.password)) {
        return res.status(400).json({ error: "The provided password is invalid." });
    }

    if (!req.body.outwardPostcode || !isValidOutwardPostcode(req.body.outwardPostcode)) {
        return res.status(400).json({ error: "The provided outward postcode is invalid." });
    }

    const referenceId = String(req.body.referenceId).toLowerCase();

    let user;
    try {
        user = await findUnactivatedUserByReferenceId(referenceId);
    } catch (e) {
        return res.status(400).json({ error: "This reference ID cannot be used to activate an account." });
    }

    let decoded;
    try {
        decoded = jwt.verify(String(req.body.token), hashSha256(String(user.id)));

        if (String(decoded.referenceId) !== String(referenceId)) {
            throw new Error("Bad reference ID in token.");
        }

        if (!decoded.email || !isValidEmail(decoded.email)) {
            return res.status(400).json({ error: "The provided email is invalid." });
        }
    } catch (e) {
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    try {
        await activateUser(user.id, referenceId, String(decoded.email).toLowerCase(), await hashPassword(req.body.password), String(req.body.outwardPostcode).toUpperCase());

        return res.status(200).json({ message: "User account activation successful." });
    } catch (e) {
        return res.status(500).json({ message: "User account activation failure." });
    }
});

export default router;
