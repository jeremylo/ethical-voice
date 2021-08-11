import Router from 'express';
import jwt from 'jsonwebtoken';
import { activateUser, findUnactivatedUserByReferenceId } from '../../persistence/users.js';
import { hashPassword, hashSha256, isValidEmail, isValidPassword, isValidReferenceId } from '../../utils.js';

const router = Router();

router.post('/', async (req, res) => {
    if (!req.body.referenceId || !isValidReferenceId(req.body.referenceId)) {
        res.status(400);
        res.json({
            error: "The provided reference ID is invalid."
        });
        return res;
    }

    if (!req.body.token || typeof req.body.token !== "string" || req.body.token.length < 32) {
        res.status(400);
        res.json({
            error: "The provided token is invalid."
        });
        return res;
    }

    if (!req.body.password || !isValidPassword(req.body.password)) {
        res.status(400);
        res.json({
            error: "The provided password is invalid."
        });
        return res;
    }

    const referenceId = String(req.body.referenceId).toLowerCase();

    let user;
    try {
        user = await findUnactivatedUserByReferenceId(referenceId);
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json({
            error: "This reference ID cannot be used to activate an account."
        });
        return res;
    }

    let decoded;
    try {
        decoded = jwt.verify(String(req.body.token), hashSha256(String(user.id)));

        if (String(decoded.referenceId) !== String(referenceId)) {
            throw new Error("Bad reference ID in token.");
        }

        if (!decoded.email || !isValidEmail(decoded.email)) {
            res.status(400);
            res.json({
                error: "The provided email is invalid."
            });
            return res;
        }
    } catch (e) {
        res.status(400);
        res.json({
            error: "The provided token is invalid."
        });
        return res;
    }

    await activateUser(user.id, referenceId, String(decoded.email).toLowerCase(), await hashPassword(req.body.password));

    res.status(200);
    res.json({
        message: "User account activation successful."
    });
});

export default router;
