import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../../email.js';
import { findSroByEmail } from '../../persistence/sros.js';
import requireAuth from '../../requireAuth.js';
import { isValidEmail } from '../../utils.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
    if (req.user.trusted !== 1) {
        return res.status(401).json({ error: "Not authorised to invite new SROs." });
    }

    if (!req.body.email || !isValidEmail(req.body.email)) {
        return res.status(400).json({ error: "Invalid email." });
    }

    if (req.body.trusted === undefined || typeof req.body.trusted !== "boolean") {
        return res.status(400).json({ error: "Invalid trusted marker." });
    }

    const email = String(req.body.email).toLowerCase();

    try {
        const sro = await findSroByEmail(email);
        if (sro) return res.status(400).json({ error: "Invalid email." });
    } catch (e) {
        // all good!
    }

    const token = jwt.sign({ email, trusted: !!req.body.trusted }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `https://mydatadashboard.jezz.me/activate/${token}`;

    console.log(`New account invitation token generated: ${token}`);

    getMailer()
        .send({
            to: email,
            from: {
                email: 'noreply@mydata.jezz.me',
                name: 'My Data Dashboard'
            },
            subject: 'Invitation to My Data Dashboard',
            html: fillTemplate(
                `
                    <h1>Invitation to My Data Dashboard</h1>
                    <p>Hi,</p>
                    <p>You have been invited to join the management dashboard for <a href="https://mydata.jezz.me/">My Data</a> as a senior responsible officer.</p>
                    <p>To join the service, click the following link: <a href="${link}">${link}</a></p>
                    <p>Best wishes,</p>
                    <p>My Data Dashboard</p>
                    `
            ),
        })
        .then(() => {
            return res.status(200).json({ message: "An invitation email has been sent." });
        })
        .catch((error) => {
            return res.status(500).json({ message: "The invitation email could not be sent." });
        });
});

export default router;
