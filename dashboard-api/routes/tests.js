import Router from 'express';
import { query } from '../db.js';
import requireAuth from '../requireAuth.js';

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

export default router;
