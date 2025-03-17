import { Request, Response, NextFunction } from "express";

// Logs du serveur
export const logger = (req: Request, _res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    next(); // Passe à la prochaine fonction middleware ou route
};
