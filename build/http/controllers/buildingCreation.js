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

// src/http/controllers/buildingCreation.ts
var buildingCreation_exports = {};
__export(buildingCreation_exports, {
  buildingController: () => buildingController
});
module.exports = __toCommonJS(buildingCreation_exports);

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
  const userid = req.user.sub;
  const { buildingName, address } = buildingSchema.parse(req.body);
  const building = await prisma.buildings.create({
    data: {
      buildingName,
      address,
      userId: userid
    }
  });
  return res.status(201).send(building);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildingController
});
