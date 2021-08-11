import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../../email.js';
import { findUnactivatedUserByReferenceId } from '../../persistence/users.js';
import { hashSha256, isValidEmail, isValidReferenceId } from '../../utils.js';

const router = Router();

router.post('/', async (req, res) => {
    if (req.isAuthenticated()) {
        res.status(401);
        res.json({
            error: "Logged in users should not be registering."
        });
        return res;
    }

    if (!req.body.referenceId || !isValidReferenceId(req.body.referenceId)) {
        res.status(400);
        res.json({
            error: "The provided reference ID is invalid."
        });
        return res;
    }

    if (!req.body.email || !isValidEmail(req.body.email)) {
        res.status(400);
        res.json({
            error: "The provided email is invalid."
        });
        return res;
    }

    const referenceId = String(req.body.referenceId).toLowerCase();
    const email = String(req.body.email).toLowerCase();

    let user;
    try {
        user = await findUnactivatedUserByReferenceId(referenceId);
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json({
            error: "Invalid user."
        });
        return res;
    }

    const confirmationToken = jwt.sign({ referenceId, email }, hashSha256(String(user.id)), { expiresIn: '1h' });
    const link = `https://mydata.jezz.me/activate/${referenceId}/${confirmationToken}`;

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

export default router;
