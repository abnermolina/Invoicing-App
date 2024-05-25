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

// src/http/controllers/deleteUser.ts
var deleteUser_exports = {};
__export(deleteUser_exports, {
  deleteUserController: () => deleteUserController
});
module.exports = __toCommonJS(deleteUser_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/http/controllers/deleteUser.ts
async function deleteUserController(req, res) {
  try {
    const userid = req.user.sub;
    const deletedUser = await prisma.user.delete({
      where: {
        id: userid
      }
    });
    if (!deletedUser) {
      return res.status(404).send({
        message: "User not found"
      });
    }
    return res.status(200).send({ message: "User deleted succesfully", user: deletedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteUserController
});
