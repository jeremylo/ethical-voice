import Router from 'express';
import multer from 'multer';
import pool from '../db.js';
import requireAuth from '../requireAuth.js';
import { isNumeric } from '../utils.js';


const isValidKey = (key) => {
    const k = String(key);
    if (k.length < 1 || k.length > 255) return false;
    return /[A-Za-z0-9]+(\.[A-Za-z0-9]+)?(\.[A-Za-z0-9]+)?/.test(k);
};

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', requireAuth, upload.single('audio'), async (req, res) => {

    const validate = () => {
        // Ensure submitted files are <15MiB
        if (req.file.size > 15 * 1024 * 1024)
            return "The provided audio file is too large.";

        // Ensure submitted audio files are audio/wav
        if (req.file.mimetype !== "audio/wav")
            return "The provided file has the wrong MIME type.";

        // Ensure the provided test ID is valid.
        if (!('testId' in req.body) || !isNumeric(req.body.testId))
            return "The provided test ID is invalid.";

        // Ensure the creation time is valid
        if (!('createdAt' in req.body) || !isNumeric(req.body.createdAt) || (new Date(+req.body.createdAt)).getTime() <= 0)
            return "The provided creation time is invalid.";
    };

    let error;
    if (error = validate()) {
        return res.status(400).json({ success: false, error });
    }

    let conn;
    try {
        let { testId, createdAt, ...unfilteredMetadata } = req.body;

        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO submissions (user_id, outward_postcode, audio, test_type_id, created_at) VALUES (?, ?, BINARY(?), ?, ?)", [
            req.user.id,
            req.user.outward_postcode,
            req.file.buffer,
            +testId,
            new Date(+createdAt).toISOString().slice(0, 19).replace('T', ' ')
        ]);

        const metadata = Object.entries(unfilteredMetadata).filter(([k, v]) => (
            isValidKey(k) && String(v).length < 65535
        ));

        if (metadata.length > 0) {
            console.log([metadata.map(([k, v]) => [result.insertId, k, v])]);
            await conn.batch("INSERT INTO submission_metadata (submission_id, metadata_key, metadata_value) VALUES (?, ?, ?)",
                metadata.map(([k, v]) => [result.insertId, k, v]));
        }

        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ success: false, error: "Something terrible has happened! D:" });
    } finally {
        if (conn) conn.release();
    }
});

export default router;
