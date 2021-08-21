import Router from 'express';
import { query } from '../db.js';
import requireAuth from '../requireAuth.js';
import { isNumeric } from '../utils.js';

const router = Router();

/**
 * Responds with all test types ever created.
 */
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

/**
 * Validates the list of possible durations in seconds provided.
 *
 * @param   {array}  durations  The array of possible durations.
 *
 * @return  {true}              True if valid.
 */
const validatePossibleDurationsList = (durations) => {
    for (const duration of durations) {
        if (!isNumeric(String(duration)) || +duration < 5 || +duration >= 1000) return false;
    }
    return true;
};

/**
 * Handles the creation of a new test type.
 */
router.post('/', requireAuth, async (req, res) => {
    if (!req.body.title || req.body.title.length > 255
        || !req.body.instruction || req.body.instruction.length > 65536
        || !req.body.possibleDurations || typeof req.body.possibleDurations !== "object"
        || !validatePossibleDurationsList(req.body.possibleDurations)
        || req.body.active === undefined) {
        return res.status(400).json({ error: "Bad request." });
    }

    try {
        await query("INSERT INTO test_types (title, instruction, possible_durations, active) VALUES (?,?,?,?)", [
            req.body.title,
            req.body.instruction,
            JSON.stringify(req.body.possibleDurations),
            req.body.active ? 1 : 0,
        ]);
        return res.status(200).json({ message: "Test type created successfully." });
    } catch {
        return res.status(500).json({ error: "Test type could not be created." });
    }
});

/**
 * Handles the visibility toggle of a given test type.
 */
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
