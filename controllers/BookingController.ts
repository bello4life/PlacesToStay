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
                people: number;
            };

            if (!body.accID || !body.date || body.people === undefined) {
                return res.status(400).json({ error: "Missing required fields: accID, date, and people are all required" });
            }

            if (!Number.isInteger(body.people) || body.people <= 0) {
                return res.status(400).json({
                    error: "Number of people must be greater than 0" 
                });
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

            const userID = req.session.userID;
            if (!userID) {
                return res.status(401).json({ error: "You must be logged in to do this" });
            }

            const bookingId = this.dao.createBooking(body.accID, body.date, userID, body.people);
            res.json({ id: bookingId });

        } catch (e) {
            if (e instanceof Error && e.message === "NO_AVAILABILITY") {
                return res.status(400).json({ error: "Not enough availability" });
            }
            console.log(e);
            res.status(500).json({ error: "Server error" });
        }
    }
}
