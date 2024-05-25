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

// src/http/controllers/updateInvoice.ts
var updateInvoice_exports = {};
__export(updateInvoice_exports, {
  updateInvoiceController: () => updateInvoiceController
});
module.exports = __toCommonJS(updateInvoice_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/updateInvoice.ts
var z = __toESM(require("zod"));
async function updateInvoiceController(req, res) {
  const updateInvoiceSchema = z.object({
    price: z.coerce.number().optional(),
    invoiceNum: z.string().optional(),
    serviceDescription: z.string().optional(),
    unit: z.string().optional(),
    createdAt: z.date().optional()
  });
  const invoiceidSchema = z.object({
    invoiceid: z.string()
  });
  const userid = req.user.sub;
  try {
    const { price, invoiceNum, serviceDescription, unit, createdAt } = updateInvoiceSchema.parse(req.body);
    const { invoiceid } = invoiceidSchema.parse(req.params);
    const updateInvoice = await prisma.invoice.update({
      where: {
        id: invoiceid,
        userId: userid
      },
      data: {
        price,
        invoiceNum,
        serviceDescription,
        unit,
        createdAt
      }
    });
    if (!updateInvoice) {
      return res.status(404).send({ message: "Invoice not found" });
    }
    return res.status(200).send({
      message: "Invoice information updated succesfully",
      invoice: updateInvoice
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateInvoiceController
});
