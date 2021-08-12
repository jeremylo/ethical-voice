import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../../email.js';
import { findActivatedUserByReferenceId, findUserByEmail, updateUserPassword } from '../../persistence/users.js';
import requireAuth, { requireNoAuth } from '../../requireAuth.js';
import { hashPassword, isValidEmail, isValidPassword, isValidPasswordHash, isValidReferenceId } from '../../utils.js';


const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (!req.body.oldPassword || !req.body.newPassword) {
        res.status(400);
        res.json({
            "error": "Not enough information was provided to effectuate the password change."
        });
        return res;
    }

    if (!(await isValidPasswordHash(req.body.oldPassword, req.user.password))) {
        res.status(401);
        res.json({
            "error": "The password was incorrect."
        });
        return res;
    }

    try {
        await updateUserPassword(req.user, await hashPassword(req.body.newPassword));
        res.status(200);
        res.json({
            message: "The password was updated successfully."
        });
    } catch (e) {
        res.status(500);
        res.json({
            message: "The password could not be updated successfully."
        });
    }
});

router.post('/request-reset', requireNoAuth, async (req, res) => {
    if (!req.body.email || !isValidEmail(req.body.email)) {
        res.status(400);
        res.json({
            error: "The provided email is invalid."
        });
        return res;
    }

    const email = String(req.body.email).toLowerCase();

    let user;
    try {
        user = await findUserByEmail(email);
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json({
            error: "Invalid user."
        });
        return res;
    }

    // By signing the password reset token with the user's current password hash,
    // the token effectively becomes single-use as any successful use of the token
    // would lead to the password hash changing, thereby invalidating all other tokens
    // generated at the same time.
    const token = jwt.sign({ referenceId: user.reference_id, email }, user.password, { expiresIn: '1h' });
    const link = `https://mydata.jezz.me/reset-password/${user.reference_id}/${token}`;

    console.log(`New password reset token generated: ${token}`);

    getMailer()
        .send({
            to: email,
            from: {
                email: 'noreply@mydata.jezz.me',
                name: 'My Data'
            },
            subject: 'Reset your password',
            html: fillTemplate(
                `
                <h1>Reset your password</h1>
                <p>Hi,</p>
                <p>To reset your password, please click the following link: <a href="${link}">${link}</a></p>
                <p>Best wishes,</p>
                <p>My Data</p>
                `
            ),
        })
        .then(() => {
            res.status(200);
            res.json({
                message: "A confirmation email has been sent."
            });
        })
        .catch((error) => {
            res.status(500);
            res.json({
                message: "The confirmation email could not be sent."
            });
        });
});

router.post('/reset', async (req, res) => {
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
        user = await findActivatedUserByReferenceId(referenceId);
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json({
            error: "This reference ID cannot be used to reset a password."
        });
        return res;
    }

    let decoded;
    try {
        decoded = jwt.verify(String(req.body.token), user.password);

        if (String(decoded.referenceId) !== String(referenceId)
            || !decoded.email || !isValidEmail(decoded.email)
            || decoded.email.toLowerCase() !== user.email.toLowerCase()
        ) {
            throw new Error("Bad token.");
        }
    } catch (e) {
        res.status(400);
        res.json({
            error: "The provided token is invalid."
        });
        return res;
    }

    try {
        await updateUserPassword(user, await hashPassword(req.body.password));
        res.status(200);
        res.json({
            message: "User account activation successful."
        });
    } catch (e) {
        res.status(500);
        res.json({
            message: "Error updating the password."
        });
    }
});

export default router;
