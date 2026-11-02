import UserDao from '../dao/UserDao';
import { Request, Response } from 'express';
import BetterSqlite3 from 'better-sqlite3';
import 'express-session';

export default class LoginController {
    dao: UserDao;

    constructor(db: BetterSqlite3.Database) {
        this.dao = new UserDao(db);
    }

    getCurrentUser(req: Request, res: Response) {
        res.json({ username: req.session.username || null });
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const user = await this.dao.findByUsernameAndPassword(username, password);
            if (user) {
                req.session.username = user.username;
                req.session.userID = user.ID;
                res.json({ username: user.username });
            } else {
                res.status(401).json({ error: 'Incorrect username or password' });
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Server error' });
        }
    }

    logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.json({ loggedout: true });
        });
    }
}
