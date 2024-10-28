import { validateToken } from "../utils/utils";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = validateToken(token);
        req.user = decoded.user;
        next();
    } catch (error) {
        
    }
} 