"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/buildings.route.ts
var buildings_route_exports = {};
__export(buildings_route_exports, {
  buildingRoutes: () => buildingRoutes
});
module.exports = __toCommonJS(buildings_route_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/buildingCreation.ts
var z = __toESM(require("zod"));
async function buildingController(req, res) {
  const buildingSchema = z.object({
    buildingName: z.string(),
    address: z.string()
  });
  const companyidSchema = z.object({
    companyid: z.string()
  });
  const userid = req.user.sub;
  const { buildingName, address } = buildingSchema.parse(req.body);
  const { companyid } = companyidSchema.parse(req.params);
  const building = await prisma.buildings.create({
    data: {
      buildingName,
      address,
      userId: userid,
      companyId: companyid
    }
  });
  return res.status(201).send(building);
}

// src/http/controllers/updateBuilding.ts
var z2 = __toESM(require("zod"));
async function updateBuildingController(req, res) {
  const updateBuildingSchema = z2.object({
    buildingName: z2.string().optional(),
    address: z2.string().optional()
  });
  const buildingidSchema = z2.object({
    buildingid: z2.string()
  });
  const userid = req.user.sub;
  try {
    const { buildingName, address } = updateBuildingSchema.parse(req.body);
    const { buildingid } = buildingidSchema.parse(req.params);
    const updateBuilding = await prisma.buildings.update({
      where: {
        id: buildingid,
        userId: userid
      },
      data: {
        buildingName,
        address
      }
    });
    if (!updateBuilding) {
      return res.status(404).send({ message: "Building not found" });
    }
    return res.status(200).send({
      message: "Building updated Succesfully",
      buildings: updateBuilding
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

// src/http/controllers/deleteBuilding.ts
var z3 = __toESM(require("zod"));
async function deleteBuildingController(req, res) {
  const deleteBuildingSchema = z3.object({
    buildingid: z3.string()
  });
  const userid = req.user.sub;
  try {
    const validatedData = deleteBuildingSchema.safeParse(req.params);
    if (!validatedData.success) {
      return res.status(400).send({ message: "Invalid request body" });
    }
    const { buildingid } = validatedData.data;
    const deletedBuilding = await prisma.buildings.delete({
      where: {
        id: buildingid,
        userId: userid
      }
    });
    if (!deletedBuilding) {
      return res.status(404).send({
        message: "Building not found"
      });
    }
    return res.status(200).send({
      message: "Building deleted succesfully",
      company: deletedBuilding
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

// src/middlewares/authUser.ts
async function jwtAuthenticate(req, res) {
  try {
    await req.jwtVerify();
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}

// src/routes/buildings.route.ts
async function buildingRoutes(app) {
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
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildingRoutes
});
