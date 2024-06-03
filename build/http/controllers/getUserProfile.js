"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/getUserProfile.ts
var getUserProfile_exports = {};
__export(getUserProfile_exports, {
  getUserProfile: () => getUserProfile
});
module.exports = __toCommonJS(getUserProfile_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/getUserProfile.ts
async function getUserProfile(req, res) {
  const userid = req.user.sub;
  const user = await prisma.user.findUnique({
    where: {
      id: userid
    },
    select: {
      id: true,
      email: true,
      name: true,
      Buildings: true,
      Invoice: true,
      Company: true,
      // exclude the password field
      password: false
    }
  });
  return res.status(200).send({
    user
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserProfile
});
