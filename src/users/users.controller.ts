import { Request, Response } from 'express';
import prisma from '../client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// Requête pour login un User
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        let user = await prisma.user.findUnique({ where: { "email": email } });

        // Vérification de l'email
        if (!user) {
            res.status(404).json({error: "Email not found"});
            return;
        }

        // Vérification du mot de passe
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            res.status(400).json({error: "Wrong password"});
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: process.env.JWT_EXPIRES_IN } as jwt.SignOptions
        );

        res.status(201).send({ token: token, message: "Connexion réussie" });
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


export const createUser = async (req: Request, res: Response) => {
    try {
        let data = req.body;
        const hashedPass = await bcrypt.hash(data.password, 10);
        data.password = hashedPass;
        await prisma.user.create({ data: data });
        res.status(201).send({ email: data.email });
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
}


export const getUsers = async (_req: Request, res: Response) => {
    try {

        const users = await prisma.user.findMany();

        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(204).send([]);
        }

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
}


export const getUser = async (req: Request, res: Response) => {
    try {

        const user = await prisma.user.findUnique({ where: { id: +req.params.userId } });

        // Vérification que le user existe
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
}


export const updateUser = async (req: Request, res: Response) => {
    try {

        let data = req.body;
        
        // Vérification que le user existe
        const userToUpdate = await prisma.user.findUnique({ where: { id: +req.params.userId } });

        if (!userToUpdate) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Si on veut changer le mot de passe, on le crypte
        if (data.password) {
            const hashedPass = await bcrypt.hash(data.password, 10);
            data.password = hashedPass;
        }

        await prisma.user.update({ where: { id: +req.params.userId }, data: data });
        res.status(200).json(data);

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {

        // Vérification que le user existe
        const userToDelete = await prisma.user.findUnique({ where: { id: +req.params.userId } });

        if (!userToDelete) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await prisma.user.delete({ where: { id: +req.params.userId } });
        res.status(200).json({ message: "User deleted" });

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
};