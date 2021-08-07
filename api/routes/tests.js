import Router from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const tests = await query("SELECT * FROM test_types WHERE active=1");
        res.status(200);
        res.json(Object.fromEntries(tests.map(test => [test.id, {
            id: test.id,
            title: test.title,
            instruction: test.instruction,
            possibleDurations: JSON.parse(test.possible_durations)
        }])));
    } catch {
        res.status(500);
        res.json([]);
    }
});

export default router;
