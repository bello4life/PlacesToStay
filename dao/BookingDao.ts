import BetterSqlite3 from 'better-sqlite3';

export default class BookingDao {
    db: BetterSqlite3.Database;

    
    constructor(db: BetterSqlite3.Database) {
        this.db = db;
    }

    checkAvailability(accID: number, date: number): number | null {
        const stmt = this.db.prepare("SELECT availability FROM acc_dates WHERE accID = ? AND thedate = ?");
        const row = stmt.get(accID, date) as { availability: number } | undefined;
        return row ? row.availability : null;
    }


    createBooking(accID: number, date: number, userID: number, people: number): number {
        const insertStmt = this.db.prepare(`
            INSERT INTO acc_bookings(accID, thedate, userID, npeople)
            VALUES(?,?,?,?)
        `);
        const updateStmt = this.db.prepare(`
            UPDATE acc_dates
            SET availability = availability - ?
            WHERE accID = ? AND thedate = ? AND availability >= ?
        `);

        // Both writes succeed together or neither is saved.
        const book = this.db.transaction(() => {
            const update = updateStmt.run(people, accID, date, people);
            if (update.changes === 0) {
                throw new Error("NO_AVAILABILITY");
            }
            return insertStmt.run(accID, date, userID, people).lastInsertRowid as number;
        });

        return book();
    }
}
