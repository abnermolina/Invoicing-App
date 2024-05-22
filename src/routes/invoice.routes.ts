import fastify, { FastifyInstance } from "fastify";
import { app } from "../app";
import { invoiceController } from "@/http/controllers/invoiceCreations";

export async function invoiceRoutes(exp: FastifyInstance) {
  app.post("/invoices/:userid/:buildingid", invoiceController);
}
