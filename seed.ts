import Database from "better-sqlite3";

// Run with: npm run seed
// Safe to run more than once. It never deletes real bookings.
const db = new Database("placestostay.db");
const DAYS_AHEAD = 90;
const DEFAULT_AVAILABILITY = 20;

// Dates are stored as YYMMDD numbers, for example 261027.
function toYYMMDD(d: Date): number {
  const yy = d.getFullYear() % 100;
  return yy * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

const cleanUp = db.transaction(() => {
  db.exec("DROP TABLE IF EXISTS acc_bookngs"); // old typo table, unused
  const bad = db.prepare("DELETE FROM acc_bookings WHERE npeople <= 0").run();
  console.log(
    `Removed ${bad.changes} bookings with an invalid number of people`,
  );
});

const addDates = db.transaction(() => {
  const places = db.prepare("SELECT ID FROM accommodation").all() as {
    ID: number;
  }[];
  const exists = db.prepare(
    "SELECT 1 FROM acc_dates WHERE accID = ? AND thedate = ?",
  );
  const insert = db.prepare(
    "INSERT INTO acc_dates(thedate, availability, accID) VALUES(?,?,?)",
  );
  let added = 0;
  for (const place of places) {
    for (let i = 1; i <= DAYS_AHEAD; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const date = toYYMMDD(d);
      if (!exists.get(place.ID, date)) {
        insert.run(date, DEFAULT_AVAILABILITY, place.ID);
        added++;
      }
    }
  }
  console.log(
    `Added ${added} availability rows for the next ${DAYS_AHEAD} days`,
  );
});

cleanUp();
addDates();
db.close();
