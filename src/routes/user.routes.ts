import fastify, { FastifyInstance } from "fastify";
import { app } from "../app";
import { registerController } from "@/http/controllers/register";
import { getUserProfile } from "@/http/controllers/getUserProfile";
import { Login } from "@/http/controllers/userLogin";
import { deleteUserController } from "@/http/controllers/deleteUser";
import { updateUserController } from "@/http/controllers/updateUserInfo";

export async function userRoutes(exp: FastifyInstance) {
  app.post("/users", registerController);
  app.get("/profile/:userid", getUserProfile);
  app.post("/login", Login);
  app.delete("/users/:userid", deleteUserController);
  app.patch("/users/:userid", updateUserController);
}
