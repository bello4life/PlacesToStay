import BetterSqlite3 from 'better-sqlite3';
import bcrypt from 'bcrypt';

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

    async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        const stmt = this.db.prepare('SELECT * FROM acc_users WHERE username = ?');
        const row = stmt.get(username) as User | undefined;
        if (!row) return null;

        const match = await bcrypt.compare(password, row.password);
        return match ? row : null;
    }
}
