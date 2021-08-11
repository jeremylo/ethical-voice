import Router from 'express';
import jwt from 'jsonwebtoken';
import { updateUserOutwardPostcode, updateUserPassword, updateUserSharing } from '../persistence/users.js';
import requireAuth from '../requireAuth.js';
import { hashPassword, hashSha256, isValidEmail, isValidOutwardPostcode, isValidPasswordHash } from '../utils.js';


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

    // By signing with a SHA256 hash of the user's current email,
    // the JWT effectively becomes "single-use" as any generated
    // tokens are invalidated whenever the email is subsequently changed.
    const confirmationToken = jwt.sign({
        userid: req.user.id,
        email: String(req.body.email).toLowerCase()
    }, hashSha256(req.user.email), { expiresIn: '1h' });

    console.log(confirmationToken);

    try {
        res.status(200);
        res.json({
            message: "A confirmation email has been sent."
        });
    } catch (e) {
        res.status(500);
        res.json({
            message: "The email could not be updated successfully."
        });
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
