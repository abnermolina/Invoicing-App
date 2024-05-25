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

// src/http/controllers/deleteCompany.ts
var deleteCompany_exports = {};
__export(deleteCompany_exports, {
  deleteCompanyController: () => deleteCompanyController
});
module.exports = __toCommonJS(deleteCompany_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/deleteCompany.ts
var z = __toESM(require("zod"));
async function deleteCompanyController(req, res) {
  const deleteCompanySchema = z.object({
    companyid: z.string()
  });
  const userid = req.user.sub;
  try {
    const validatedData = deleteCompanySchema.safeParse(req.params);
    if (!validatedData.success) {
      return res.status(400).send({ message: "Invalid request body" });
    }
    const { companyid } = validatedData.data;
    const deleteCompany = await prisma.company.delete({
      where: {
        id: companyid,
        userId: userid
      }
    });
    if (!deleteCompany) {
      return res.status(404).send({
        message: "Company not found"
      });
    }
    return res.status(200).send({
      message: "Company deleted succesfully",
      company: deleteCompany
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteCompanyController
});
