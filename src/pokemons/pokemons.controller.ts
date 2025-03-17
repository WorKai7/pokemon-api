import { Request, Response } from 'express';
import prisma from '../client';

// Requête pour récuperer la liste des pokémons
export const getPokemons = async (_req: Request, res: Response) => {
    try {
        const pokemons = await prisma.pokemonCard.findMany();

        if (pokemons.length > 0) {
            res.status(200).send(pokemons);
        } else {
            res.status(204).send([]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Requête de récupération d'un pokémon entré en paramètre
export const getPokemon = async (req: Request, res: Response) => {
    try {
        const pokemons = await prisma.pokemonCard.findUnique({
            where: { id: +req.params.pokemonCardId },
        });

        // Vérification que le pokémon existe
        if (pokemons) {
            res.status(200).send(pokemons);
        } else {
            res.status(404).send({ error: 'PokemonCard not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Requête pour créer un pokémon
export const createPokemon = async (req: Request, res: Response) => {
    try {
        // Vérification des champs required
        const missingFields = [];
        req.body.name ?? missingFields.push('name');
        req.body.pokedexId ?? missingFields.push('pokedexId');
        req.body.typeId ?? missingFields.push('typeId');
        req.body.lifePoints ?? missingFields.push('lifePoints');
        req.body.attackId ?? missingFields.push('attackId');

        if (missingFields.length > 0) {
            res.status(400).json({
                error: 'Field(s) missing',
                fields: missingFields,
            });
            return;
        }

        // Vérification que le type entré existe
        const typeExists = await prisma.type.findUnique({
            where: { id: +req.body.typeId },
        });
        if (!typeExists) {
            res.status(400).json({ error: 'Unknown type' });
            return;
        }

        const attackExists = await prisma.pokemonAttack.findUnique({
            where: { id: req.body.attackId },
        });
        if (!attackExists) {
            res.status(400).json({ error: 'Unknown attack' });
            return;
        }

        if (req.body.weaknessId) {
            const weaknessExists = await prisma.type.findUnique({
                where: { id: req.body.weaknessId },
            });
            if (!weaknessExists) {
                res.status(400).json({ error: 'Unknown weakness' });
                return;
            }
        }

        // Vérification que les données entrées ne constituent pas un doublon en bdd
        const doublon = await prisma.pokemonCard.findFirst({
            where: {
                OR: [
                    { name: req.body.name },
                    { pokedexId: req.body.pokedexId },
                ],
            },
        });
        if (doublon) {
            res.status(400).json({ error: 'name or pokedexId already exist' });
            return;
        }

        // Tous les tests sont passés,
        // Création du pokémon en bdd
        await prisma.pokemonCard.create({ data: req.body });
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Requête pour mettre à jour un pokémon mis en paramètre
export const updatePokemon = async (req: Request, res: Response) => {
    try {
        // Vérification des champs required
        const missingFields = [];
        req.body.name ?? missingFields.push('name');
        req.body.pokedexId ?? missingFields.push('pokedexId');
        req.body.typeId ?? missingFields.push('typeId');
        req.body.lifePoints ?? missingFields.push('lifePoints');
        req.body.attackId ?? missingFields.push('attackId');

        if (missingFields.length > 0) {
            res.status(400).json({
                error: 'Field(s) missing',
                fields: missingFields,
            });
            return;
        }

        // Vérification que le type entré existe
        const typeExists = await prisma.type.findUnique({
            where: { id: +req.body.typeId },
        });
        if (!typeExists) {
            res.status(400).json({ error: 'Unknown type' });
            return;
        }

        const attackExists = await prisma.pokemonAttack.findUnique({
            where: { id: req.body.attackId },
        });
        if (!attackExists) {
            res.status(400).json({ error: 'Unknown attack' });
            return;
        }

        if (req.body.weaknessId) {
            const weaknessExists = await prisma.type.findUnique({
                where: { id: req.body.weaknessId },
            });
            if (!weaknessExists) {
                res.status(400).json({ error: 'Unknown weakness' });
                return;
            }
        }

        // Vérification que les données entrées ne consituent pas de doublon
        const doublon = await prisma.pokemonCard.findFirst({
            where: {
                OR: [
                    { name: req.body.name },
                    { pokedexId: req.body.pokedexId },
                ],
            },
        });
        if (doublon) {
            res.status(400).json({ error: 'name or pokedexId already exist' });
            return;
        }

        // Vérification que le pokémon voulant être modifié existe en bdd
        const updatePokemon = await prisma.pokemonCard.findUnique({
            where: { id: +req.params.pokemonCardId },
        });
        if (!updatePokemon) {
            res.status(404).json({ error: 'Pokemon not found' });
            return;
        }

        // Tous les tests sont passés, on update le pokémon
        await prisma.pokemonCard.update({
            where: { id: +req.params.pokemonCardId },
            data: req.body,
        });
        res.status(200).json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Requête pour supprimer un pokémon mis en paramètre
export const deletePokemon = async (req: Request, res: Response) => {
    try {
        // Vérification que le pokémon voulant être modifié existe bien
        const deletePokemon = await prisma.pokemonCard.findUnique({
            where: { id: +req.params.pokemonCardId },
        });
        if (!deletePokemon) {
            res.status(404).json({ error: 'Pokemon not found' });
            return;
        }

        await prisma.pokemonCard.delete({
            where: { id: +req.params.pokemonCardId },
        });
        res.status(204).send(
            `Le pokémon n°${req.params.pokemonCardId} à été supprimé de la base de données avec succès !`,
        );
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
