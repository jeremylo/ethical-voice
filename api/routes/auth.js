import Router from 'express';

const router = Router();

router.get('/user', (req, res) => {
    res.status(200);
    res.json({
        refId: 1234567890,
        email: 'test@example.com',
        outwardPostcode: 'SW1',
        sharing: true
    });
});

export default router;
