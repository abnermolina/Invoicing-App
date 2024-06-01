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

// src/http/controllers/uploadCompanyLogo.ts
var uploadCompanyLogo_exports = {};
__export(uploadCompanyLogo_exports, {
  uploadLogoController: () => uploadLogoController
});
module.exports = __toCommonJS(uploadCompanyLogo_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadLogoController
});
