import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';
import jwt from 'jsonwebtoken';

describe('PokemonAttacks API', () => {
    describe('GET /pokemon-attacks', () => {
        it('should fetch all PokemonAttacks', async () => {
            const mockAttacks = [
                { id: 1, name: 'attaque1', damages: 5, typeId: 5 },
                { id: 1, name: 'attaque1', damages: 5, typeId: 5 },
                { id: 1, name: 'attaque1', damages: 5, typeId: 5 },
            ];

            prismaMock.pokemonAttack.findMany.mockResolvedValue(mockAttacks);

            const response = await request(app).get('/pokemon-attacks');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAttacks);
        });
    });

    describe('GET /pokemon-attacks/:pokemonAttackId', () => {
        it('should fetch a PokemonAttack by ID', async () => {
            const mockAttack = {
                id: 1,
                name: 'Attaque',
                damages: 50,
                typeId: 5,
            };

            prismaMock.pokemonAttack.findUnique.mockResolvedValue(mockAttack);

            const response = await request(app).get(
                '/pokemon-attacks/:pokemonAttackId',
            );

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAttack);
        });
    });

    describe('POST /pokemon-attacks', () => {
        it('should create a new PokemonAttack', async () => {
            const token = jwt.sign({ email: 'test' }, 'SECRET_TOKEN');

            const createdPokemonAttack = {
                id: 3,
                name: 'Attaque',
                damages: 473,
                typeId: 6,
            };

            prismaMock.type.findUnique.mockResolvedValue({
                id: 6,
                name: 'Ice',
            });
            prismaMock.pokemonAttack.create.mockResolvedValue(
                createdPokemonAttack,
            );

            const response = await request(app)
                .post('/pokemon-attacks')
                .set('Authorization', `Bearer: ${token}`)
                .send(createdPokemonAttack);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdPokemonAttack);
        });
    });

    describe('PATCH /pokemon-attacks/:pokemonAttackId', () => {
        it('should update an existing PokemonAttack', async () => {
            const token = jwt.sign({ email: 'test' }, 'SECRET_TOKEN');

            const pokemonAttackToUpdate = {
                id: 3,
                name: 'Attaque',
                damages: 473,
                typeId: 6,
            };
            const updatedPokemonAttack = {
                id: 3,
                name: 'UpdatedAttack',
                damages: 473,
                typeId: 6,
            };

            prismaMock.type.findUnique.mockResolvedValue({
                id: 6,
                name: 'Ice',
            });
            prismaMock.pokemonAttack.findUnique.mockResolvedValue(
                pokemonAttackToUpdate,
            );
            prismaMock.pokemonAttack.update.mockResolvedValue(
                updatedPokemonAttack,
            );

            const response = await request(app)
                .patch('/pokemon-attacks/:pokemonAttackId')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedPokemonAttack);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedPokemonAttack);
        });
    });

    describe('DELETE /pokemon-attacks/:pokemonAttackId', () => {
        it('should delete a PokemonAttack', async () => {
            const token = jwt.sign({ email: 'test' }, 'SECRET_TOKEN');

            const pokemonAttack = {
                id: 3,
                name: 'Attaque',
                damages: 473,
                typeId: 6,
            };

            prismaMock.pokemonAttack.delete.mockResolvedValue(pokemonAttack);
            prismaMock.pokemonAttack.findUnique.mockResolvedValue(
                pokemonAttack,
            );

            const response = await request(app)
                .delete('/pokemon-attacks/:pokemonAttackId')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Attack deleted' });
        });
    });
});

afterAll(() => {
    stopServer();
});
