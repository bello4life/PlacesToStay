import AccommodationDao from '../dao/AccommodationDao';
import { Request, Response } from 'express';
import BetterSqlite3 from 'better-sqlite3';

export default class AccommodationController {
    dao: AccommodationDao;

    constructor(db: BetterSqlite3.Database) {
        this.dao = new AccommodationDao(db);
    }

    findByLocation(req: Request, res: Response) {
        try {
            const results = this.dao.findByLocation(req.params.location as string);
            res.json(results);
        } catch (e) {
            res.status(500).json({ error: "Server error" });
        }
    }

    findByLocationAndType(req: Request, res: Response) {
        try {
            const results = this.dao.findByLocationAndType(req.params.location as string, req.params.type as string);
            res.json(results);
        } catch (e) {
            res.status(500).json({ error: "Server error" });
        }
    }
}
