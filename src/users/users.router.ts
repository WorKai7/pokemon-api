import { Router } from "express";
import {
    loginUser,
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} from "./users.controller";
import { verifyJWT } from "../common/verify";

export const userRouter = Router();

userRouter.post("/login", loginUser);
userRouter.get("/", getUsers);
userRouter.get("/:userId", getUser);
userRouter.post("/", verifyJWT, createUser);
userRouter.patch("/:userId", verifyJWT, updateUser);
userRouter.delete("/:userId", verifyJWT, deleteUser);
