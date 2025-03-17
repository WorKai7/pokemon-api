import { Request, Response, NextFunction } from 'express';

// Logs du serveur
export const logger = (req: Request, _res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Requête reçue : ${req.method} ${req.url}`);
    next(); // Passe à la prochaine fonction middleware ou route
};