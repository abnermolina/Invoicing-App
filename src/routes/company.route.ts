import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { companyController } from "@/http/controllers/companyCreation";
import { updateCompanyController } from "@/http/controllers/updateCompanyInfo";
import { deleteCompanyController } from "@/http/controllers/deleteCompany";
import { jwtAuthenticate } from "@/middlewares/authUser";
import { uploadLogoController } from "@/http/controllers/uploadCompanyLogo";
export async function companyRoutes(app: FastifyInstance) {
  app.addHook("onRequest", jwtAuthenticate);

  app.post("/company", companyController);

  app.delete("/company/:companyid", deleteCompanyController);

  app.patch("/company/:companyid", updateCompanyController);

  app.patch("/company/logo/:companyid", uploadLogoController);
}
