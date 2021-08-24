import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../../email.js';
import { findUnactivatedUserByReferenceId } from '../../persistence/users.js';
import { requireNoAuth } from '../../requireAuth.js';
import { hashSha256, isValidEmail, isValidReferenceId } from '../../utils.js';

const router = Router();

/**
 *  Handles the registration of a new user.
 *
 *  Registration is invite-only (requiring a reference ID).
 *
 *  Their details are encoded into a JSON web token sent to their requested email
 *  and only then hit the database if activation is successful.
 */
router.post('/', requireNoAuth, async (req, res) => {
    if (!req.body.referenceId || !isValidReferenceId(req.body.referenceId)) {
        return res.status(400).json({ error: "The provided reference ID is invalid." });
    }

    if (!req.body.email || !isValidEmail(req.body.email)) {
        return res.status(400).json({ error: "The provided email is invalid." });
    }

    const referenceId = String(req.body.referenceId).toLowerCase();
    const email = String(req.body.email).toLowerCase();

    let user;
    try {
        user = await findUnactivatedUserByReferenceId(referenceId);
    } catch (e) {
        return res.status(400).json({ error: "Invalid user." });
    }

    const confirmationToken = jwt.sign({ referenceId, email }, hashSha256(String(user.id)), { expiresIn: '1h' });
    const link = `https://${process.env.APP_DOMAIN}/activate/${referenceId}/${confirmationToken}`;

    console.log(`New account email confirmation token generated: ${confirmationToken}`);

    getMailer()
        .send({
            to: email,
            from: {
                email: 'noreply@mydata.jezz.me',
                name: 'My Data'
            },
            subject: 'Confirm your email',
            html: fillTemplate(
                `
                <h1>Confirm your email address</h1>
                <p>Hi,</p>
                <p>To confirm your email address, click the following link: <a href="${link}">${link}</a></p>
                <p>Best wishes,</p>
                <p>My Data</p>
                `
            ),
        })
        .then(() => {
            return res.status(200).json({ message: "A confirmation email has been sent." });
        })
        .catch((error) => {
            return res.status(500).json({ message: "The confirmation email could not be sent." });
        });
});

export default router;
