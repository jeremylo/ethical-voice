import Router from 'express';
import requireAuth from '../requireAuth.js';
import { updateUserOutwardPostcode, updateUserPassword, updateUserSharing } from '../users.js';
import { hashPassword, isValidOutwardPostcode, isValidPasswordHash } from '../utils.js';


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

router.post('/password', requireAuth, async (req, res) => {
    if (req.body.oldPassword && req.body.newPassword) {
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