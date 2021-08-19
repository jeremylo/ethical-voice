import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../../email.js';
import { findSroById, updateSroEmail } from '../../persistence/sros.js';
import requireAuth from '../../requireAuth.js';
import { hashSha256, isNumeric, isValidEmail } from '../../utils.js';


const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (!req.body.email || !isValidEmail(req.body.email) || req.body.email.toLowerCase() === req.user.email.toLowerCase()) {
        return res.status(400).json({ "error": "The provided email is invalid." });
    }

    // By signing with a SHA256 hash of the user's current email,
    // the JWT effectively becomes "single-use" as any generated
    // tokens are invalidated whenever the email is subsequently changed.
    const confirmationToken = jwt.sign({ sroid: req.user.id, email: req.body.email }, hashSha256(req.user.email), { expiresIn: '1h' });
    const link = `https://${process.env.DASHBOARD_DOMAIN}/api/sro/email/verify?sroid=${req.user.id}&token=${confirmationToken}`;

    console.log(`New email update confirmation token generated: ${confirmationToken}`);

    getMailer()
        .send({
            to: req.body.email,
            from: {
                email: 'noreply@mydata.jezz.me',
                name: 'My Data Dashboard'
            },
            subject: 'Confirm your email',
            html: fillTemplate(
                `
                <h1>Confirm your email address</h1>
                <p>Hi,</p>
                <p>To confirm your email address, click the following link: <a href="${link}">${link}</a></p>
                <p>Best wishes,</p>
                <p>My Data Dashboard</p>
                `
            ),
        })
        .then(() => {
            return res.status(200).json({ message: "A confirmation email has been sent." });
        })
        .catch((error) => {
            return res.status(500).json({ message: "The email could not be updated successfully." });
        })
});

router.get('/verify', async (req, res) => {
    if (!req.query.sroid || !isNumeric(req.query.sroid) || +req.query.sroid <= 0 || !req.query.token) {
        return res.status(400).send("Apologies - your email could not be confirmed.");
    }

    try {
        const sro = await findSroById(+req.query.sroid);
        const decoded = jwt.verify(req.query.token, hashSha256(sro.email));

        if (!decoded.sroid || !isNumeric(decoded.sroid) || +decoded.sroid !== +req.query.sroid) {
            throw new Error("Bad SRO id.");
        }

        if (!decoded.email || !isValidEmail(decoded.email)) {
            throw new Error("Bad email.")
        }

        await updateSroEmail(sro, decoded.email);

        if (req.user) { // log the user out if logged in
            req.session.destroy();
            req.logout();
        }

        return res.status(200).redirect('/login/email-update-successful');
    } catch (e) {
        return res.status(400).send("Apologies - your email could not be confirmed as this link is either invalid or expired.");
    }
});

export default router;
