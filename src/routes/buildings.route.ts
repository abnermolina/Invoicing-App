import fastify, { FastifyInstance } from "fastify";
import { buildingController } from "@/http/controllers/buildingCreation";
import { updateBuildingController } from "@/http/controllers/updateBuilding";
import { deleteBuildingController } from "@/http/controllers/deleteBuilding";
import { jwtAuthenticate } from "@/middlewares/authUser";

export async function buildingRoutes(app: FastifyInstance) {
  app.post("/buildings", { onRequest: [jwtAuthenticate] }, buildingController);
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
}
