import BetterSqlite3 from 'better-sqlite3';

interface User {
    ID: number;
    username: string;
    password: string;
    admin: number;
}

export default class UserDao {
    db: BetterSqlite3.Database;

    constructor(db: BetterSqlite3.Database) {
        this.db = db;
    }

    findByUsernameAndPassword(username: string, password: string): User | null {
        const stmt = this.db.prepare('SELECT * FROM acc_users WHERE username = ? AND password = ?');
        const row = stmt.get(username, password) as User | undefined;
        return row || null;
    }
}
