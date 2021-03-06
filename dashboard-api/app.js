import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import passport from './passport.js';
import redisClient from './redis.js';
import authRoutes from './routes/auth.js';
import exportRoutes from './routes/export.js';
import patientRoutes from './routes/patient.js';
import patientsRoutes from './routes/patients.js';
import referralRoutes from './routes/referral.js';
import sroRoutes from './routes/sro.js';
import srosRoutes from './routes/sros.js';
import submissionsRoutes from './routes/submissions.js';
import testsRoutes from './routes/tests.js';

const app = express();

const RedisStore = ConnectRedis(session);

/**
 * Sets up express app middleware.
 */
app.use(cookieParser(process.env.DASHBOARD_COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: new RedisStore({
        client: redisClient,
        prefix: "dashboardapi:session:"
    }),
    secret: process.env.DASHBOARD_COOKIE_SECRET,
    resave: true,
    cookie: {
        secure: "auto",
        httpOnly: true,
        sameSite: true,
    },
    name: process.env.DASHBOARD_SESSION_COOKIE_NAME,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Sets up app routes.
 */
app.get('/api', (req, res) => {
    res.send('Hi, you may be in the wrong place.');
});

app.use('/api/auth', authRoutes);
app.use('/api/sro', sroRoutes);
app.use('/api/sros', srosRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/submissions', submissionsRoutes);

export default app;
