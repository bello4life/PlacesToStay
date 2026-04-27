import { Request, Response } from 'express';

export default function loginMiddleware(req: Request, res: Response, next: () => void) {
    if (["POST", "DELETE"].indexOf(req.method) == -1) {
        next();
    } else {
        if (req.session.username) {
            next();
        } else {
            res.status(401).json({ error: "You must be logged in to do this" });
        }
    }
}
