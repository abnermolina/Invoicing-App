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

// src/http/controllers/userLogin.ts
var userLogin_exports = {};
__export(userLogin_exports, {
  Login: () => Login
});
module.exports = __toCommonJS(userLogin_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/userLogin.ts
var z = __toESM(require("zod"));
var import_bcryptjs = __toESM(require("bcryptjs"));
async function Login(req, res) {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
  });
  const { email, password } = loginSchema.parse(req.body);
  try {
    const loginUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    const token = await res.jwtSign(
      {},
      {
        sign: {
          sub: loginUser?.id
        }
      }
    );
    const passwordMatch = await import_bcryptjs.default.compare(
      password,
      loginUser?.password || ""
    );
    if (!loginUser) {
      return res.status(401).send({ message: "Incorrect email" });
    }
    if (!passwordMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }
    return res.status(200).setCookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 86400,
      signed: true
    }).send({ message: "Login successful" });
  } catch (error) {
    console.log(error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Login
});
