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

// src/routes/company.route.ts
var company_route_exports = {};
__export(company_route_exports, {
  companyRoutes: () => companyRoutes
});
module.exports = __toCommonJS(company_route_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/companyCreation.ts
var z = __toESM(require("zod"));
async function companyController(req, res) {
  const companySchema = z.object({
    companyName: z.string(),
    companyAddress: z.string()
  });
  const userid = req.user.sub;
  const { companyName, companyAddress } = companySchema.parse(req.body);
  const company = await prisma.company.create({
    data: {
      companyName,
      companyAddress,
      userId: userid,
      companyLogo: ""
    }
  });
  return res.status(201).send(company);
}

// src/http/controllers/updateCompanyInfo.ts
var z2 = __toESM(require("zod"));
async function updateCompanyController(req, res) {
  const updateCompanySchema = z2.object({
    companyName: z2.string().optional(),
    companyAddress: z2.string().optional()
  });
  const companyidSchema = z2.object({
    companyid: z2.string()
  });
  const userid = req.user.sub;
  try {
    const { companyName, companyAddress } = updateCompanySchema.parse(req.body);
    const { companyid } = companyidSchema.parse(req.params);
    const updateCompany = await prisma.company.update({
      where: {
        id: companyid,
        userId: userid
      },
      data: {
        companyName,
        companyAddress
      }
    });
    if (!updateCompany) {
      return res.status(404).send({ message: "Company not found" });
    }
    return res.status(200).send({
      message: "Company information updated succesfully",
      company: updateCompany
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

// src/http/controllers/deleteCompany.ts
var z3 = __toESM(require("zod"));
async function deleteCompanyController(req, res) {
  const deleteCompanySchema = z3.object({
    companyid: z3.string()
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

// src/middlewares/authUser.ts
async function jwtAuthenticate(req, res) {
  try {
    await req.jwtVerify();
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}

// src/http/controllers/uploadCompanyLogo.ts
var import_zod = require("zod");
var import_aws_sdk = require("aws-sdk");
var import_dotenv = require("dotenv");
var import_uuid = require("uuid");
var import_path = __toESM(require("path"));
async function uploadLogoController(req, res) {
  (0, import_dotenv.config)();
  const s3 = new import_aws_sdk.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  const uploadDataSchema = import_zod.z.object({
    companyid: import_zod.z.string()
    // Expecting a string for company ID
  });
  const { companyid } = uploadDataSchema.parse(req.params);
  const image = await req.file();
  const userid = req.user.sub;
  if (!image) {
    return res.status(400).send({ message: "No logo uploaded" });
  }
  const fileExtension = import_path.default.extname(image.filename);
  const s3Key = `${(0, import_uuid.v4)()}${fileExtension}`;
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    // Bucket name from environment variables
    Key: s3Key,
    // Unique key for the file in S3
    Body: image?.file,
    // Image data
    ContentType: image.mimetype
    // Mime type of the image
  };
  const s3Response = await s3.upload(uploadParams).promise();
  const updateCompany = await prisma.company.update({
    where: {
      id: companyid,
      // Company ID
      userId: userid
      // User ID
    },
    data: {
      companyLogo: s3Response.Location
      // URL of the uploaded logo in S3
    }
  });
  return res.status(200).send({ message: "Logo uploaded successfully", updateCompany });
}

// src/routes/company.route.ts
async function companyRoutes(app) {
  app.addHook("onRequest", jwtAuthenticate);
  app.post("/company", companyController);
  app.delete("/company/:companyid", deleteCompanyController);
  app.patch("/company/:companyid", updateCompanyController);
  app.patch("/company/logo/:companyid", uploadLogoController);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  companyRoutes
});
