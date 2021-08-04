import express from 'express';
import authRoutes from './routes/auth.js';
import modelRoutes from './routes/model.js';
import testsRoutes from './routes/tests.js';

const app = express();
const port = 4000;

app.get('/api', (req, res) => {
    res.send('Hi, you may be in the wrong place.');
});

app.use('/api/auth', authRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/model', modelRoutes);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
