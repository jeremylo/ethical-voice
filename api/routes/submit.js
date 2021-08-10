import Router from 'express';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', upload.single('audio'), (req, res) => {

    if (req.file.size > 15 * 1024 * 1024) { // 15MiB
        res.status(200);
        res.json({
            error: "The provided audio file is too large."
        });
    }

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
