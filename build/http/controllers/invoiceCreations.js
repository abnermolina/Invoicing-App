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

// src/http/controllers/invoiceCreations.ts
var invoiceCreations_exports = {};
__export(invoiceCreations_exports, {
  invoiceController: () => invoiceController
});
module.exports = __toCommonJS(invoiceCreations_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/invoiceCreations.ts
var z = __toESM(require("zod"));
async function invoiceController(req, res) {
  const invoiceSchema = z.object({
    price: z.number(),
    invoiceNum: z.string(),
    serviceDescription: z.string(),
    unit: z.string()
  });
  const buildingidSchema = z.object({
    buildingid: z.string()
  });
  const { buildingid } = buildingidSchema.parse(req.params);
  const { price, invoiceNum, serviceDescription, unit } = invoiceSchema.parse(
    req.body
  );
  const userid = req.user.sub;
  const building = await prisma.user.findUnique({
    where: { id: userid },
    select: { Buildings: true }
  });
  const invoice = await prisma.invoice.create({
    data: {
      price,
      invoiceNum,
      serviceDescription,
      unit,
      userId: userid,
      buildingsId: buildingid
    }
  });
  return res.status(201).send(invoice);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  invoiceController
});
