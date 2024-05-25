import fastify, { FastifyInstance } from "fastify";
import { app } from "../app";
import { companyController } from "@/http/controllers/companyCreation";
import { updateCompanyController } from "@/http/controllers/updateCompanyInfo";
import { deleteCompanyController } from "@/http/controllers/deleteCompany";
import { jwtAuthenticate } from "@/middlewares/authUser";

export async function companyRoutes(exp: FastifyInstance) {
  app.post("/company", { onRequest: [jwtAuthenticate] }, companyController);
  app.patch(
    "/company/:companyid",
    { onRequest: [jwtAuthenticate] },
    updateCompanyController
  );
  app.delete(
    "/company/:companyid",
    { onRequest: [jwtAuthenticate] },
    deleteCompanyController
  );
}
