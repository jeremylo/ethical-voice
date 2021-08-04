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

app.get('/api/tests', (req, res) => {
    try {
        res.status(200)
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
        })
    } catch {
        res.status(500);
        res.json([]);
    }
})

app.get('/api/user', (req, res) => {
    res.status(200);
    res.json({
        refId: 1234567890,
        email: 'test@example.com',
        outwardPostcode: 'SW1',
        sharing: true
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
