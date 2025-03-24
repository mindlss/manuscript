import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string;

export interface DecodedToken {
    userId: string;
}

class AuthMiddleware {
    static verifyToken(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

        if (!token) {
            res.status(403).json({ error: 'No token provided' });
            return;
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const decodedToken = decoded as DecodedToken;
            req.userId = decodedToken.userId;
            next();
        });
    }
}

export default AuthMiddleware;
