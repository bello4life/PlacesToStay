import AccommodationDao from '../dao/AccommodationDao';
import { Request, Response } from 'express';
import BetterSqlite3 from 'better-sqlite3';
import xss from 'xss';

export default class AccommodationController {
    dao: AccommodationDao;

    constructor(db: BetterSqlite3.Database) {
        this.dao = new AccommodationDao(db);
    }

    private sanitise(results: any[]): any[] {
        return results.map(r => ({
            ...r,
            name: xss(r.name),
            type: xss(r.type),
            location: xss(r.location),
            description: xss(r.description)
        }));
    }

    findByLocation(req: Request, res: Response) {
        try {
            const results = this.dao.findByLocation(req.params.location as string);
            res.json(this.sanitise(results));
        } catch (e) {
            res.status(500).json({ error: "Server error" });
        }
    }

    findByLocationAndType(req: Request, res: Response) {
        try {
            const results = this.dao.findByLocationAndType(req.params.location as string, req.params.type as string);
            res.json(this.sanitise(results));
        } catch (e) {
            res.status(500).json({ error: "Server error" });
        }
    }
}
