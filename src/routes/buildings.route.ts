import fastify, { FastifyInstance } from "fastify";
import { buildingController } from "@/http/controllers/buildingCreation";
import { updateBuildingController } from "@/http/controllers/updateBuilding";
import { deleteBuildingController } from "@/http/controllers/deleteBuilding";
import { jwtAuthenticate } from "@/middlewares/authUser";
import { getBuildingController } from "@/http/controllers/getBuilding";

export async function buildingRoutes(app: FastifyInstance) {
  app.post(
    "/buildings/:companyid",
    { onRequest: [jwtAuthenticate] },
    buildingController
  );
  app.patch(
    "/buildings/:buildingid",
    { onRequest: [jwtAuthenticate] },
    updateBuildingController
  );
  app.delete(
    "/buildings/:buildingid",
    { onRequest: [jwtAuthenticate] },
    deleteBuildingController
  );
  app.get(
    "/buildings",
    { onRequest: [jwtAuthenticate] },
    getBuildingController
  );
}
