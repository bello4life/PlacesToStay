import express from 'express';
import database from 'better-sqlite3';
import ViteExpress from 'vite-express';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';

const app = express();
app.use(express.json());
const db = new database("placestostay.db");

const sessDb = new database('session.db');
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


app.get('/login', (req, res) => {
    res.json({ username: req.session.username || null });
});


app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const stmt = db.prepare('SELECT * FROM acc_users WHERE username = ? AND password = ?');
        const user = stmt.get(username, password);
        if (user) {
            req.session.username = username;
            res.json({ username: username });
        } else {
            res.status(401).json({ error: 'Incorrect username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ loggedout: true });
    });
});


app.use((req, res, next) => {
    if(["POST", "DELETE"].indexOf(req.method) == -1) {
        next();
    } else {
        if(req.session.username) {
            next();
        } else {
            res.status(401).json({ error: "You must be logged in to do this" });
        }
    }
});



app.get("/accommodation/:location", (req, res) => {
  try {
    const stmt = db.prepare(
      "SELECT * FROM accommodation WHERE location = ?"
    );

    const results = stmt.all(req.params.location);

    res.json(results);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/accommodation/:location/:type", (req, res) => {
  try {
    const stmt = db.prepare(
      "SELECT * FROM accommodation WHERE location = ? AND type = ?"
    );

    const results = stmt.all(req.params.location, req.params.type);

    res.json(results);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post('/accommodation/book', (req, res) => {
    try {

        const body = req.body as {
            accID: number;
            date: number;
            userID: number;
            people: number;
        };


        if (!body.accID || !body.date || !body.people) {
        return res.status(400).json({ error: "Missing required fields: accID, date, and people are all required" });
        }

    
        const checkStmt = db.prepare(`
            SELECT availability FROM acc_dates
            WHERE accID = ? AND thedate = ?
        `);

        const row = checkStmt.get(body.accID, body.date) as { availability: number } | undefined;


        if (!row) {
            return res.status(400).json({ error: "No availability for this date" });
        }

    
        if (row.availability < body.people) {
            return res.status(400).json({ error: "Not enough availability" });
        }

        const insertStmt = db.prepare(`
            INSERT INTO acc_bookings(accID, thedate, userID, npeople)
            VALUES(?,?,?,?)
        `);

        const info = insertStmt.run(
            body.accID,
            body.date,
            body.userID,
            body.people
        );

        const updateStmt = db.prepare(`
            UPDATE acc_dates
            SET availability = availability - ?
            WHERE accID = ? AND thedate = ?
        `);

        updateStmt.run(
            body.people,
            body.accID,
            body.date
        );

        res.json({ id: info.lastInsertRowid });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});



const PORT = 3000;

ViteExpress.listen(app, PORT, () => {
    console.log(`Express server with Vite integration now running on ${PORT}...`)
});