import fastify, { FastifyInstance } from "fastify";
import { app } from "../app";
import { buildingController } from "@/http/controllers/buildingCreation";

export async function buildingRoutes(exp: FastifyInstance) {
  app.post("/buildings/:userid", buildingController);
}
