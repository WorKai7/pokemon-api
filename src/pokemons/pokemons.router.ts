import { Router } from 'express';
import { createPokemon, getPokemon, getPokemons, updatePokemon, deletePokemon } from './pokemons.controller';
import { verifyJWT } from '../common/verify';

export const pokemonRouter = Router();

pokemonRouter.get('/', getPokemons);
pokemonRouter.get('/:pokemonCardId', getPokemon);
pokemonRouter.post('/', verifyJWT, createPokemon);
pokemonRouter.patch('/:pokemonCardId', verifyJWT, updatePokemon);
pokemonRouter.delete('/:pokemonCardId', verifyJWT, deletePokemon);