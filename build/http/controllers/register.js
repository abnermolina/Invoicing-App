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

// src/http/controllers/register.ts
var register_exports = {};
__export(register_exports, {
  registerController: () => registerController
});
module.exports = __toCommonJS(register_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/register.ts
var z = __toESM(require("zod"));
var import_bcryptjs = require("bcryptjs");
async function registerController(req, res) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
  });
  const { email, name, password } = registerSchema.parse(req.body);
  const hashedPassword = await (0, import_bcryptjs.hash)(password, 10);
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    }
  });
  return res.status(201).send({ message: "User created successfully" });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerController
});
