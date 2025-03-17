import { Request, Response } from 'express';
import prisma from '../client';


export const getPokemonAttacks = async (_req: Request, res: Response) => {
    try {
        
        const pokemonAttacks = await prisma.pokemonAttack.findMany();

        if (pokemonAttacks.length > 0) {
            res.status(200).send(pokemonAttacks);
        } else {
            res.status(204).send([]);
        }

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


export const getPokemonAttack = async (req: Request, res: Response) => {
    try {

        const pokemonAttack = await prisma.pokemonAttack.findUnique({ where: { id: +req.params.pokemonAttackId } });

        if (pokemonAttack) {
            res.status(200).send(pokemonAttack);
        } else {
            res.status(404).send({ error: 'PokemonAttack not found' });
        }

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


export const createPokemonAttack = async (req: Request, res: Response) => {
    try {

        let missingFields = []
        req.body.name ?? missingFields.push("name");
        req.body.damages ?? missingFields.push("damages");
        req.body.typeId ?? missingFields.push("typeId");

        if (missingFields.length > 0) {
            res.status(400).json({ error: "Field(s) missing", fields: missingFields });
            return;
        }


        const typeExists = await prisma.type.findUnique({ where: { id: +req.body.typeId } });
        if (!typeExists) {
            res.status(400).json({ error: "Unknown type" });
            return;
        }


        const doublon = await prisma.pokemonAttack.findFirst({ where: { AND: [{ name: req.body.name }, { damages: req.body.damages }, { typeId: req.body.typeId }] } });
        if (doublon) {
            res.status(400).json({ error: "Attack already exists" });
            return;
        }


        await prisma.pokemonAttack.create({ data: req.body });
        res.status(201).json(req.body);

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


export const updatePokemonAttack = async (req: Request, res: Response) => {
    try {

        let missingFields = []
        req.body.name ?? missingFields.push("name");
        req.body.damages ?? missingFields.push("damages");
        req.body.typeId ?? missingFields.push("typeId");

        if (missingFields.length > 0) {
            res.status(400).json({ error: "Field(s) missing", fields: missingFields });
            return;
        }


        const typeExists = await prisma.type.findUnique({ where: { id: +req.body.typeId } })
        if (!typeExists) {
            res.status(400).json({ error: "Unknown type" });
            return;
        }


        const doublon = await prisma.pokemonAttack.findFirst({ where: { AND: [{ name: req.body.name }, { damages: req.body.damages }, { typeId: req.body.typeId }] } });
        if (doublon) {
            res.status(400).json({ error: "Attack already exists" });
            return;
        }


        const updateAttack = await prisma.pokemonAttack.findUnique({ where: { id: +req.params.pokemonAttackId } });
        if (!updateAttack) {
            res.status(404).json({ error: "Attack not found" })
            return;
        }


        await prisma.pokemonAttack.update({ where: { id: +req.params.pokemonAttackId }, data: req.body });
        res.status(200).json(req.body);

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


export const deletePokemonAttack = async (req: Request, res: Response) => {
    try {

        const deleteAttack = await prisma.pokemonAttack.findUnique({ where: { id: +req.params.pokemonAttackId } });
        if (!deleteAttack) {
            res.status(404).json({ error: "Attack not found" })
            return;
        }


        await prisma.pokemonAttack.delete({ where: { id: +req.params.pokemonAttackId } });
        res.status(200).json({ message: "Attack deleted" });

    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
};