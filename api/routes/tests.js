import Router from 'express';

const router = Router();

router.get('/', (req, res) => {
    try {
        res.status(200);
        res.json({
            1: {
                id: 1,
                possibleDurations: [10, 30, 60, 90, 120],
                title: "Counting numbers",
                instruction: "Please count out loud up from one clearly at a fast but comfortable speaking pace until the timer runs out."
            },
            2: {
                id: 2,
                possibleDurations: [10, 30, 60, 90, 120],
                title: "Repeating hippopotamus",
                instruction: "Please repeatedly say 'hippopotamus' at a fast but comfortable speaking pace until the timer runs out."
            },
        });
    } catch {
        res.status(500);
        res.json([]);
    }
});

export default router;
