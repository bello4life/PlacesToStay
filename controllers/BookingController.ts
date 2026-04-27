import BookingDao from '../dao/BookingDao';
import { Request, Response } from 'express';
import BetterSqlite3 from 'better-sqlite3';

export default class BookingController {
    dao: BookingDao;

    constructor(db: BetterSqlite3.Database) {
        this.dao = new BookingDao(db);
    }

    book(req: Request, res: Response) {
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

            const today = new Date();
            const yy = today.getFullYear() % 100;
            const mm = today.getMonth() + 1;
            const dd = today.getDate();
            const todayNum = yy * 10000 + mm * 100 + dd;

            if (body.date < todayNum) {
                return res.status(400).json({ error: "The date you selected is in the past. Please choose a future date." });
            }

            const availability = this.dao.checkAvailability(body.accID, body.date);

            if (availability === null) {
                return res.status(400).json({ error: "No availability for this date" });
            }

            if (availability < body.people) {
                return res.status(400).json({ error: "Not enough availability" });
            }

            const bookingId = this.dao.createBooking(body.accID, body.date, body.userID, body.people);
            res.json({ id: bookingId });

        } catch (e) {
            console.log(e);
            res.status(500).json({ error: "Server error" });
        }
    }
}
