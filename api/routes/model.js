import Router from 'express';
import path from 'path';

const router = Router();

const modelPath = path.join(path.resolve(), 'public', 'model.zip');

router.get('/', (req, res) => {
    try {
        res.status(200);
        console.log(`[${new Date()}]: sending model to ${req.ip}`);
        res.sendFile(modelPath);
    } catch {
        res.status(500);
        res.send("Sorry - we're having some issues. Please try again later!");
    }
})

export default router;
