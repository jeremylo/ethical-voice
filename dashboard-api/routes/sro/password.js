import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../../email.js';
import { findSroByEmail, findSroById, updateSroPassword } from '../../persistence/sros.js';
import requireAuth, { requireNoAuth } from '../../requireAuth.js';
import { hashPassword, isNumeric, isValidEmail, isValidPassword, isValidPasswordHash } from '../../utils.js';




const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (!req.body.oldPassword || !req.body.newPassword) {
        return res.status(400).json({ "error": "Not enough information was provided to effectuate the password change." });
    }

    if (!(await isValidPasswordHash(req.body.oldPassword, req.user.password))) {
        return res.status(401).json({ "error": "The password was incorrect." });
    }

    try {
        await updateSroPassword(req.user, await hashPassword(req.body.newPassword));
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

    let sro;
    try {
        sro = await findSroByEmail(email);
    } catch (e) {
        return res.status(400).json({ error: "Invalid user." });
    }

    // By signing the password reset token with the SRO's current password hash,
    // the token effectively becomes single-use as any successful use of the token
    // would lead to the password hash changing, thereby invalidating all other tokens
    // generated at the same time.
    const token = jwt.sign({ sroid: sro.id, email }, sro.password, { expiresIn: '1h' });
    const link = `https://${process.env.DASHBOARD_DOMAIN}/reset-password/${sro.id}/${token}`;

    console.log(`New password reset token generated: ${token}`);

    getMailer()
        .send({
            to: email,
            from: {
                email: 'noreply@mydata.jezz.me',
                name: 'My Data Dashboard'
            },
            subject: 'Reset your password',
            html: fillTemplate(
                `
                <h1>Reset your password</h1>
                <p>Hi,</p>
                <p>To reset your password, please click the following link: <a href="${link}">${link}</a></p>
                <p>Best wishes,</p>
                <p>My Data Dashboard</p>
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
    if (!req.body.sroid || !isNumeric(req.body.sroid) || +req.body.sroid <= 0) {
        return res.status(400).send("The provided SRO ID is invalid.");
    }

    if (!req.body.token || typeof req.body.token !== "string" || req.body.token.length < 32) {
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    if (!req.body.password || !isValidPassword(req.body.password)) {
        return res.status(400).json({ error: "The provided password is invalid." });
    }

    let sro;
    try {
        sro = await findSroById(req.body.sroid);
    } catch (e) {
        return res.status(400).json({ error: "Password update request denied." });
    }

    let decoded;
    try {
        decoded = jwt.verify(String(req.body.token), sro.password);
        if (!decoded.sroid || !isNumeric(decoded.sroid) || +decoded.sroid <= 0 || +decoded.sroid !== +sro.id) {
            return res.status(400).send("The provided SRO ID is invalid.");
        }
    } catch (e) {
        return res.status(400).json({ error: "The provided token is invalid." });
    }

    try {
        await updateSroPassword(sro, await hashPassword(req.body.password));
        return res.status(200).json({ message: "SRO password reset successful." });
    } catch (e) {
        return res.status(500).json({ message: "Error updating the password." });
    }
});

export default router;
