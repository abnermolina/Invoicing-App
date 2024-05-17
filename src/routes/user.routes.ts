import fastify, { FastifyInstance } from "fastify";
import { app } from "../app";
import { registerController } from "@/http/controllers/register";

export async function userRoutes(exp: FastifyInstance) {
  app.post("/users", registerController);
}
