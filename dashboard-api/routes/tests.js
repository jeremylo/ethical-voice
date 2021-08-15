import Router from 'express';
import { query } from '../db.js';
import requireAuth from '../requireAuth.js';
import { isNumeric } from '../utils.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const tests = await query("SELECT * FROM test_types");
        return res.status(200).json(Object.fromEntries(tests.map(test => [test.id, {
            id: test.id,
            title: test.title,
            instruction: test.instruction,
            possibleDurations: JSON.parse(test.possible_durations),
            active: test.active
        }])));
    } catch {
        return res.status(500).json([]);
    }
});

router.post('/visibility', requireAuth, async (req, res) => {
    if (!req.body.testId || !isNumeric(req.body.testId) || +req.body.testId <= 0
        || req.body.active === undefined || typeof req.body.active !== "boolean") {
        return res.status(400).json({ error: "Bad request." });
    }

    try {
        await query("UPDATE test_types SET active=? WHERE id=?", [
            req.body.active ? 1 : 0,
            +req.body.testId
        ]);
        return res.status(200).json({ message: "Test visibility updated successfully." });
    } catch {
        return res.status(500).json({ error: "Test visibility could not be updated." });
    }
});

export default router;
