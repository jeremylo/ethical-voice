import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import passport from './passport.js';
import authRoutes from './routes/auth.js';
import modelRoutes from './routes/model.js';
import testsRoutes from './routes/tests.js';

const app = express();
const port = 4000;

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    secret: process.env.COOKIE_SECRET,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: true
    },
    name: 'SID',
    // rolling: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.get('/api', (req, res) => {
    res.send('Hi, you may be in the wrong place.');
});

app.use('/api/auth', authRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/model', modelRoutes);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
