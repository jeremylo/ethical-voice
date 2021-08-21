import Router from 'express';
import path from 'path';

const router = Router();

const modelPath = path.join(path.resolve(), 'public', 'model.zip');

/**
 * Sends the Kaldi speech model to the user.
 *
 * @param   {Request}   req  Express request object
 * @param   {Response}  res  Express response object
 *
 * @return  {Response}       Express response object
 */
router.get('/', (req, res) => {
    try {
        return res.status(200).sendFile(modelPath, {
            lastModified: false,
            cacheControl: true,
            maxAge: '1d'
        });
    } catch {
        return res.status(500).send("Sorry - we're having some issues. Please try again later!");
    }
})

export default router;
