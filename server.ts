import express from 'express';
import database from 'better-sqlite3';

const app = express();
app.use(express.json());
const db = new database("placestostay.db");


app.get('/', (req,res)=> {
    res.send('Hello World from Express!');

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
            apiID: string;
            accID: number;
            date: number;
            userID: number;
            people: number;
        };

        if (body.apiID !== "0x574144") {
            return res.status(403).json({ error: "Invalid API ID" });
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

app.listen(PORT, () => `Express server with Vite integration now running on ${PORT}...`);