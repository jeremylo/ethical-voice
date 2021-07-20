import express from 'express';
import path from 'path';

const app = express()
const port = 4000

const modelPath = path.join(path.resolve(), 'public', 'model.zip')

app.get('/api', (req, res) => {
    res.send('Hi, you may be in the wrong place.')
})

app.get('/api/model', (req, res) => {
    try {
        res.status(200)
        console.log(`[${new Date()}]: sending model to ${req.ip}`)
        res.sendFile(modelPath)
    } catch {
        res.status(500);
        res.send("Sorry - we're having some issues. Please try again later!");
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
