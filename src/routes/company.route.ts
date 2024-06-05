import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { companyController } from "@/http/controllers/companyCreation";
import { updateCompanyController } from "@/http/controllers/updateCompanyInfo";
import { deleteCompanyController } from "@/http/controllers/deleteCompany";
import { jwtAuthenticate } from "@/middlewares/authUser";
import { uploadLogoController } from "@/http/controllers/uploadCompanyLogo";
import { getCompanyController } from "@/http/controllers/getCompany";
export async function companyRoutes(app: FastifyInstance) {
  //app.addHook("onRequest", jwtAuthenticate); // adds protection to our routes

  app.post("/company",{onRequest: [jwtAuthenticate]} ,companyController);

  app.delete("/company/:companyid", {onRequest: [jwtAuthenticate]},deleteCompanyController);

  app.patch("/company/:companyid", {onRequest: [jwtAuthenticate]},updateCompanyController);

  app.patch("/company/logo/:companyid", {onRequest: [jwtAuthenticate]},uploadLogoController);

  app.get("/company", {onRequest: [jwtAuthenticate]},getCompanyController);
}
