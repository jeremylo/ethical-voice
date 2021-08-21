import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../../email.js';
import { findActivatedUserByReferenceId, findUserByEmail, updateUserPassword } from '../../persistence/users.js';
import requireAuth, { requireNoAuth } from '../../requireAuth.js';
import { hashPassword, isValidEmail, isValidPassword, isValidPasswordHash, isValidReferenceId } from '../../utils.js';


const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (!req.body.oldPassword || !req.body.newPassword) {
        return res.status(400).json({ "error": "Not enough information was provided to effectuate the password change." });
    }

    if (!(await isValidPasswordHash(req.body.oldPassword, req.user.password))) {
        return res.status(401).json({ "error": "The password was incorrect." });
    }

    try {
        await updateUserPassword(req.user.id, await hashPassword(req.body.newPassword));
        return res.status(200).json({ message: "The password was updated successfully." });
    } catch (e) {
        return res.status(500).json({ message: "The password could not be updated successfully." });
    }
});

router.post('/request-reset', requireNoAuth, async (req, res) => {
    if (!req.body.email || !isValidEmail(req.body.email)) {
        return res.status(400).json({ error: "The provided email is invalid." });
    }

    const email = String(req.body.email).toLowerCase();

    let user;
    try {
        user = await findUserByEmail(email);
    } catch (e) {
        return res.status(400).json({ error: "Invalid user." });
    }

    // By signing the password reset token with the user's current password hash,
    // the token effectively becomes single-use as any successful use of the token
    // would lead to the password hash changing, thereby invalidating all other tokens
    // generated at the same time.
    const token = jwt.sign({ referenceId: user.reference_id, email }, user.password, { expiresIn: '1h' });
    const link = `https://${process.env.APP_DOMAIN}/reset-password/${user.reference_id}/${token}`;

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
            return res.status(200).json({ message: "A confirmation email has been sent." });
        })
        .catch((e) => {
            return res.status(500).json({ message: "The confirmation email could not be sent." });
        });
});

router.post('/reset', async (req, res) => {
    if (!req.body.referenceId || !isValidReferenceId(req.body.referenceId)) {
        return res.status(400).json({ error: "The provided reference ID is invalid." });
    }

    if (!req.body.token || typeof req.body.token !== "string" || req.body.token.length < 32) {
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    if (!req.body.password || !isValidPassword(req.body.password)) {
        return res.status(400).json({ error: "The provided password is invalid." });
    }

    const referenceId = String(req.body.referenceId).toLowerCase();

    let user;
    try {
        user = await findActivatedUserByReferenceId(referenceId);
    } catch (e) {
        return res.status(400).json({ error: "This reference ID cannot be used to reset a password." });
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
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    try {
        await updateUserPassword(user.id, await hashPassword(req.body.password));
        return res.status(200).json({ message: "Password reset successful." });
    } catch (e) {
        return res.status(500).json({ message: "Error updating the password." });
    }
});

export default router;
