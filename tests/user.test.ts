import request from "supertest";
import { app, stopServer } from "../src";
import { prismaMock } from "./jest.setup";
import jwt from "jsonwebtoken";

describe("User API", () => {
    describe("POST /users", () => {
        it("should create a new user", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");
            const createdUser = { id: 4, email: "test1", password: "passtest" };

            prismaMock.user.create.mockResolvedValue(createdUser);

            const response = await request(app)
                .post("/users")
                .set("Authorization", `Bearer ${token}`)
                .send(createdUser);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ email: createdUser.email });
        });

        it("should return an error (no token)", async () => {
            const createdUser = { id: 4, email: "test1", password: "passtest" };

            prismaMock.user.create.mockResolvedValue(createdUser);

            const response = await request(app)
                .post("/users")
                .send(createdUser);

            expect(response.status).toBe(401);
        });

        it("should return a server error", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");
            const createdUser = { id: 4, email: "test1", password: "passtest" };

            prismaMock.user.create.mockRejectedValue(new Error());

            const response = await request(app)
                .post("/users")
                .set("Authorization", `Bearer ${token}`)
                .send(createdUser);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Erreur serveur" });
        });
    });

    describe("POST /login", () => {
        it("should login a user and return a token", async () => {
            // Valeurs attendues
            const user = { id: 4, email: "test1", password: "passhash" };
            const token = "mockedToken";

            const login = { email: "test1", password: "truePassword" };

            prismaMock.user.findUnique.mockResolvedValue(user);

            const response = await request(app)
                .post("/users/login")
                .send(login);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                token,
                message: "Connexion réussie",
            });
        });

        it("should return an error (email not found)", async () => {
            const login = { email: "test1", password: "truePassword" };

            prismaMock.user.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .post("/users/login")
                .send(login);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Email not found" });
        });

        it("should return an error (wrong password)", async () => {
            const user = { id: 4, email: "test1", password: "passhash" };
            const login = { email: "test1", password: "wrongPassword" };

            prismaMock.user.findUnique.mockResolvedValue(user);

            const response = await request(app)
                .post("/users/login")
                .send(login);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Wrong password" });
        });

        it("should return a server error", async () => {
            const login = { email: "test1", password: "wrongPassword" };

            prismaMock.user.findUnique.mockRejectedValue(new Error());

            const response = await request(app)
                .post("/users/login")
                .send(login);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Erreur serveur" });
        });
    });

    describe("GET /users", () => {
        it("should get the users list", async () => {
            const mockUsers = [
                { id: 1, email: "mail1", password: "r87FE4Ff4R5h4I" },
                { id: 1, email: "mail1", password: "g4747G1B4ht758" },
                { id: 1, email: "mail1", password: "R54Gk1u54BVB7h" },
            ];

            prismaMock.user.findMany.mockResolvedValue(mockUsers);

            const response = await request(app).get("/users");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
        });

        it("should return an empty list", async () => {
            prismaMock.user.findMany.mockResolvedValue([]);

            const response = await request(app).get("/users");

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        });

        it("should return a server error", async () => {
            prismaMock.user.findMany.mockRejectedValue(new Error());

            const response = await request(app).get("/users");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Erreur serveur" });
        });
    });

    describe("GET /users/:userId", () => {
        it("should get a user", async () => {
            const mockUser = {
                id: 2,
                email: "mail2",
                password: "gr5fGR2jnCs4V",
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const response = await request(app).get("/users/userId");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });

        it("should return an error: user not found", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const response = await request(app).get("/users/userId");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "User not found" });
        });

        it("should return a server error", async () => {
            prismaMock.user.findUnique.mockRejectedValue(new Error());

            const response = await request(app).get("/users/userId");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Erreur serveur" });
        });
    });

    describe("PATCH /users/:userId", () => {
        it("should update a user", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");

            const userToUpdate = { id: 1, email: "test", password: "testpass" };
            const updatedUser = {
                id: 1,
                email: "updatedemail",
                password: "updatedpass",
            };

            prismaMock.user.findUnique.mockResolvedValue(userToUpdate);
            prismaMock.user.update.mockResolvedValue(updatedUser);

            const response = await request(app)
                .patch("/users/:userId")
                .set("Authorization", `Bearer ${token}`)
                .send(updatedUser);

            expect(response.status).toBe(200);
            expect(response.body.id).toEqual(updatedUser.id);
            expect(response.body.email).toEqual(updatedUser.email);
        });

        it("should return an error (user not found)", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");

            prismaMock.user.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .patch("/users/:userId")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "User not found" });
        });

        it("should return a server error", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");

            prismaMock.user.findUnique.mockRejectedValue(new Error());

            const response = await request(app)
                .patch("/users/:userId")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Erreur serveur" });
        });
    });

    describe("DELETE /users/:userId", () => {
        it("should delete a user", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");

            const user = { id: 3, email: "mail", password: "pass" };

            prismaMock.user.findUnique.mockResolvedValue(user);
            prismaMock.user.delete.mockResolvedValue(user);

            const response = await request(app)
                .delete("/users/:userId")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "User deleted" });
        });

        it("should return an error (user not found)", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");

            prismaMock.user.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .delete("/users/:userId")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "User not found" });
        });

        it("should return a server error", async () => {
            const token = jwt.sign({ email: "test" }, "SECRET_TOKEN");

            prismaMock.user.findUnique.mockRejectedValue(new Error());

            const response = await request(app)
                .delete("/users/:userId")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Erreur serveur" });
        });
    });
});

afterAll(() => {
    stopServer();
});
