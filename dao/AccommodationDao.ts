import BetterSqlite3 from 'better-sqlite3';

interface Accommodation {
    ID: number;
    name: string;
    type: string;
    location: string;
    latitude: number;
    longitude: number;
    description: string;
}


export default class AccommodationDao {
    db: BetterSqlite3.Database;

    constructor(db: BetterSqlite3.Database) {
        this.db = db;
    }

    findByLocation(location: string): Accommodation[] {
        const stmt = this.db.prepare("SELECT * FROM accommodation WHERE location = ?");
        return stmt.all(location) as Accommodation[];
    }


    findByLocationAndType(location: string, type: string): Accommodation[] {
        const stmt = this.db.prepare("SELECT * FROM accommodation WHERE location = ? AND type = ?");
        return stmt.all(location, type) as Accommodation[];
    }
}
