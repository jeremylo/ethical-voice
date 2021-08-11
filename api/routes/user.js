import Router from 'express';
import jwt from 'jsonwebtoken';
import getMailer, { fillTemplate } from '../email.js';
import { findUserById, updateUserEmail, updateUserOutwardPostcode, updateUserPassword, updateUserSharing } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';
import { hashPassword, hashSha256, isNumeric, isValidEmail, isValidOutwardPostcode, isValidPasswordHash } from '../utils.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        res.status(200);
        res.json({
            refId: req.user.reference_id,
            email: req.user.email,
            outwardPostcode: req.user.outward_postcode,
            sharing: req.user.sharing === 1
        });
    } catch (e) {
        res.status(500);
        res.json({
            error: "User information could not be retrieved."
        });
    }

});

router.post('/email', requireAuth, async (req, res) => {
    if (!req.body.email || !isValidEmail(req.body.email)) { // || req.body.email === req.user.email
        res.status(200);
        res.json({
            "error": "The provided email is invalid."
        });
        return res;
    }

    const email = String(req.body.email).toLowerCase();

    // By signing with a SHA256 hash of the user's current email,
    // the JWT effectively becomes "single-use" as any generated
    // tokens are invalidated whenever the email is subsequently changed.
    const confirmationToken = jwt.sign({ userid: req.user.id, email }, hashSha256(req.user.email), { expiresIn: '1h' });
    const link = `https://mydata.jezz.me/api/user/email/verify?userid=${req.user.id}&token=${confirmationToken}`;

    console.log(`New email update confirmation token generated: ${confirmationToken}`);

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
                message: "The email could not be updated successfully."
            });
        })
});

router.get('/email/verify', async (req, res) => {
    if (!req.query.userid || !isNumeric(req.query.userid) || +req.query.userid <= 0 || !req.query.token) {
        res.status(200);
        res.send("Apologies - your email could not be confirmed.");
        return res;
    }

    try {
        const user = await findUserById(+req.query.userid);
        const decoded = jwt.verify(req.query.token, hashSha256(user.email));

        if (!decoded.userid || !isNumeric(decoded.userid) || +decoded.userid !== +req.query.userid) {
            throw new Error("Bad user id.");
        }

        if (!decoded.email || !isValidEmail(decoded.email)) {
            throw new Error("Bad email.")
        }

        await updateUserEmail(user, decoded.email);

        if (req.user) { // log the user out
            res.clearCookie(process.env.REMEMBER_ME_COOKIE_NAME, { path: '/' });
            req.session.destroy();
            req.logout();
        }

        res.status(200);
        res.send("Your new email has been confirmed! You may now close this window and log back into the app.");
    } catch (e) {
        res.status(200);
        res.send("Apologies - your email could not be confirmed as this link is either invalid or expired.");
        return res;
    }
});

router.post('/password', requireAuth, async (req, res) => {
    if (!req.body.oldPassword || !req.body.newPassword) {
        res.status(401);
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

router.post('/outwardpostcode', requireAuth, async (req, res) => {
    if (req.body.outwardPostcode && isValidOutwardPostcode(req.body.outwardPostcode)) {
        try {
            await updateUserOutwardPostcode(req.user, req.body.outwardPostcode);
            res.status(200);
            res.json({
                message: "The outward postcode was updated successfully."
            });
        } catch (e) {
            res.status(500);
            res.json({
                message: "The outward postcode could not be updated successfully."
            });
        }
    } else {
        res.status(500);
        res.json({
            message: "Bad outward postcode input D:"
        });
    }
});

router.post('/sharing', requireAuth, async (req, res) => {
    if (req.body.sharing !== undefined && typeof req.body.sharing === "boolean") {
        try {
            await updateUserSharing(req.user, req.body.sharing);
            res.status(200);
            res.json({
                message: "The sharing agreement status was updated successfully."
            });
        } catch (e) {
            res.status(500);
            res.json({
                message: "The sharing agreement status could not be updated successfully."
            });
        }
    }
});


export default router;
