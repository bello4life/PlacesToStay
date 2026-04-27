import express from 'express';
import ViteExpress from 'vite-express';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';
import Database from 'better-sqlite3';
import loginRouter from './routes/loginRouter';
import accommodationRouter from './routes/accommodationRouter';
import bookingRouter from './routes/bookingRouter';
import loginMiddleware from './middleware/loginMiddleware';

const app = express();
app.use(express.json());

const sessDb = new Database('session.db');
const SqliteStore = betterSqlite3Session(expressSession, sessDb);

app.use(expressSession({
    store: new SqliteStore(),
    secret: 'placestostay2526',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    proxy: true,
    cookie: {
        maxAge: 600000,
        httpOnly: false
    }
}));

// Login routes must come before the login middleware, otherwise login itself would be blocked
app.use('/', loginRouter);

// Accommodation search routes - GET, so not blocked by login middleware anyway
app.use('/accommodation', accommodationRouter);

// Login middleware to protect POST and DELETE routes
app.use(loginMiddleware);

// Booking router - POST only, protected by the middleware above
app.use('/accommodation', bookingRouter);

const PORT = 3000;

ViteExpress.listen(app, PORT, () => {
    console.log(`Express server with Vite integration now running on ${PORT}...`);
});
