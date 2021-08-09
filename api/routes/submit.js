import Router from 'express';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('audio'), (req, res) => {

    console.log(req.body);
    console.log(req.file);

    res.status(200);
    res.json({});

    try {

    } catch {
        res.status(500);
        res.json([]);
    }
});

export default router;
