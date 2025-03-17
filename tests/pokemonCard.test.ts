import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';
import jwt from 'jsonwebtoken';

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        { id: 1, name: "Dracaufeu", pokedexId: 6, typeId: 2, lifePoints: 78, size: 1.7, weight: 90.5, imageUrl: "https://www.pokepedia.fr/images/thumb/1/17/Dracaufeu-RFVF.png/250px-Dracaufeu-RFVF.png", weaknessId: 7, attackId: 1 },
        { id: 2, name: "Taupiqueur", pokedexId: 50, typeId: 9, lifePoints: 10, size: 0.2, weight: 0.8, imageUrl: "https://www.pokepedia.fr/images/thumb/a/aa/Taupiqueur-RFVF.png/250px-Taupiqueur-RFVF.png", weaknessId: 7, attackId: 1 },
        { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 }
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get("/pokemons-cards");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });


    it('should fetch an empty list', async () => {

      prismaMock.pokemonCard.findMany.mockResolvedValue([]);

      const response = await request(app).get("/pokemons-cards");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });


    it('should return a server error', async () => {

      prismaMock.pokemonCard.findMany.mockRejectedValue(new Error());

      const response = await request(app).get("/pokemons-cards");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur serveur" });
    });
  });



  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = { id: 2, name: "Taupiqueur", pokedexId: 50, typeId: 9, lifePoints: 10, size: 0.2, weight: 0.8, imageUrl: "https://www.pokepedia.fr/images/thumb/a/aa/Taupiqueur-RFVF.png/250px-Taupiqueur-RFVF.png", weaknessId: 7, attackId: 1 };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);

      const response = await request(app).get("/pokemons-cards/:pokemonCardId");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });


    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/pokemons-cards/:pokemonCardId");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'PokemonCard not found' });
    });

    
    it('should return a server error', async () => {

      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error());

      const response = await request(app).get("/pokemons-cards/:pokemonCardId");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur serveur" });
    });
  });



  describe('POST /pokemon-cards', () => {
    it('should create a new PokemonCard', async () => {

      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValue({ id: 6, name: "Ice" });
      prismaMock.pokemonAttack.findUnique.mockResolvedValue({ id: 5, name: "Attaque", damages: 10, typeId: 6 });
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);
    });


    it("should return an error (name field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it("should return an error (pokedexId field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it("should return an error (typeId field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it("should return an error (lifePoints field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it('should return an error (unknown type)', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Unknown type" });
    });


    it('should return an error (name or pokedexId already exist)', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValue({ id: 6, name: "Ice" });
      prismaMock.pokemonAttack.findUnique.mockResolvedValue({ id: 5, name: "Attaque", damages: 10, typeId: 6 });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(createdPokemonCard);
      prismaMock.pokemonCard.findFirst.mockResolvedValue(createdPokemonCard);

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "name or pokedexId already exist" });
    });


    it('should return a server error', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockRejectedValue(new Error());

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur serveur" });
    });


    it("should return an error (weakness type not found)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValueOnce({ id: 6, name: "Ice" });
      prismaMock.pokemonAttack.findUnique.mockResolvedValue({ id: 5, name: "Attaque", damages: 10, typeId: 6 });
      prismaMock.type.findUnique.mockResolvedValueOnce(null);

      const response = await request(app).post("/pokemons-cards").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Unknown weakness" });
    })
  });



  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const pokemonCardToUpdate = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };
      const updatedPokemonCard = { id: 3, name: "MammochonLeGoat", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValue({ id: 6, name: "Ice" });
      prismaMock.pokemonAttack.findUnique.mockResolvedValue({ id: 5, name: "Attaque", damages: 10, typeId: 6 });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(pokemonCardToUpdate);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`).send(updatedPokemonCard);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
    });


    it("should return an error (name field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const updatedPokemonCard = { id: 3, pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`).send(updatedPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it("should return an error (pokedexId field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it("should return an error (typeId field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it("should return an error (lifePoints field missing)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const createdPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer: ${token}`).send(createdPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Field(s) missing");
    });


    it('should return an error (unknown type)', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const updatedPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`).send(updatedPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Unknown type" });
    });


    it('should return an error (name or pokedexId already exist)', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const updatedPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValue({ id: 6, name: "Ice" });
      prismaMock.pokemonAttack.findUnique.mockResolvedValue({ id: 5, name: "Attaque", damages: 10, typeId: 6 });
      prismaMock.pokemonCard.findFirst.mockResolvedValue(updatedPokemonCard);

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer: ${token}`).send(updatedPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "name or pokedexId already exist" });
    });


    it('should return an error (pokemon not found)', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const updatedPokemonCard = { id: 3, name: "MammochonLeGoat", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValue({ id: 6, name: "Ice" });
      prismaMock.pokemonAttack.findUnique.mockResolvedValue({ id: 5, name: "Attaque", damages: 10, typeId: 6 });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`).send(updatedPokemonCard);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Pokemon not found" });
    });


    it('should return a server error', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const updatedPokemonCard = { id: 3, name: "MammochonLeGoat", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockRejectedValue(new Error());

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`).send(updatedPokemonCard);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur serveur" });
    });


    it("should return an error (weakness type not found)", async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const updatedPokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.type.findUnique.mockResolvedValueOnce({ id: 6, name: "Ice" });
      prismaMock.pokemonAttack.findUnique.mockResolvedValue({ id: 5, name: "Attaque", damages: 10, typeId: 6 });
      prismaMock.type.findUnique.mockResolvedValueOnce(null);

      const response = await request(app).patch("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer: ${token}`).send(updatedPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Unknown weakness" });
    })
  });


  
  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      const pokemonCard = { id: 3, name: "Mammochon", pokedexId: 473, typeId: 6, lifePoints: 110, size: 2.5, weight: 291.0, imageUrl: "https://www.pokepedia.fr/images/thumb/3/3c/Mammochon-DP.png/250px-Mammochon-DP.png", weaknessId: 7, attackId: 1 };

      prismaMock.pokemonCard.delete.mockResolvedValue(pokemonCard);
      prismaMock.pokemonCard.findUnique.mockResolvedValue(pokemonCard);

      const response = await request(app).delete("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
    });


    it('should return an error (pokemon not found)', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).delete("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Pokemon not found" });
    });


    it('should return an error (pokemon not found)', async () => {
      const token = jwt.sign({ email: "test" }, 'SECRET_TOKEN');

      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error());

      const response = await request(app).delete("/pokemons-cards/:pokemonCardId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erreur serveur" });
    });
  });
});


afterAll(() => {
  stopServer();
})