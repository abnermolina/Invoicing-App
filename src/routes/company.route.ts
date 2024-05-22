import fastify, { FastifyInstance } from "fastify";
import { app } from "../app";
import { companyController } from "@/http/controllers/companyCreation";

export async function companyRoutes(exp: FastifyInstance) {
  app.post("/company/:userid", companyController);
}
