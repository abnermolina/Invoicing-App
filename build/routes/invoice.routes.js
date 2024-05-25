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

// src/routes/invoice.routes.ts
var invoice_routes_exports = {};
__export(invoice_routes_exports, {
  invoiceRoutes: () => invoiceRoutes
});
module.exports = __toCommonJS(invoice_routes_exports);

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

// src/http/controllers/updateInvoice.ts
var z2 = __toESM(require("zod"));
async function updateInvoiceController(req, res) {
  const updateInvoiceSchema = z2.object({
    price: z2.coerce.number().optional(),
    invoiceNum: z2.string().optional(),
    serviceDescription: z2.string().optional(),
    unit: z2.string().optional(),
    createdAt: z2.date().optional()
  });
  const invoiceidSchema = z2.object({
    invoiceid: z2.string()
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

// src/middlewares/authUser.ts
async function jwtAuthenticate(req, res) {
  try {
    await req.jwtVerify();
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}

// src/http/controllers/deleteInvoice.ts
var z3 = __toESM(require("zod"));
async function deleteInvoiceController(req, res) {
  const deleteInvoiceSchema = z3.object({
    invoiceid: z3.string()
  });
  const userid = req.user.sub;
  try {
    const validatedData = deleteInvoiceSchema.safeParse(req.params);
    if (!validatedData.success) {
      return res.status(400).send({ message: "Invalid request body" });
    }
    const { invoiceid } = validatedData.data;
    const deleteInvoice = await prisma.invoice.delete({
      where: {
        id: invoiceid,
        userId: userid
      }
    });
    if (!deleteInvoice) {
      return res.status(404).send({
        message: "Invoice not found"
      });
    }
    return res.status(200).send({
      message: "Invoice deleted succesfully",
      invoice: deleteInvoice
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

// src/routes/invoice.routes.ts
async function invoiceRoutes(app) {
  app.post(
    "/invoices/:buildingid",
    { onRequest: [jwtAuthenticate] },
    invoiceController
  );
  app.patch(
    "/invoices/:invoiceid",
    { onRequest: [jwtAuthenticate] },
    updateInvoiceController
  );
  app.delete(
    "/invoices/:invoiceid",
    { onRequest: [jwtAuthenticate] },
    deleteInvoiceController
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  invoiceRoutes
});
