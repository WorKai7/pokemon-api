import { Router } from 'express';
import { verifyJWT } from '../common/verify';
import {
    createPokemonAttack,
    deletePokemonAttack,
    getPokemonAttack,
    getPokemonAttacks,
    updatePokemonAttack,
} from './pokemon_attacks.controller';

export const pokemonAttacksRouter = Router();

pokemonAttacksRouter.get('/', getPokemonAttacks);
pokemonAttacksRouter.get('/:pokemonAttackId', getPokemonAttack);
pokemonAttacksRouter.post('/', verifyJWT, createPokemonAttack);
pokemonAttacksRouter.patch('/:pokemonAttackId', verifyJWT, updatePokemonAttack);
pokemonAttacksRouter.delete(
    '/:pokemonAttackId',
    verifyJWT,
    deletePokemonAttack,
);
