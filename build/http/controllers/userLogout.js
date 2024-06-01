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

// src/http/controllers/userLogout.ts
var userLogout_exports = {};
__export(userLogout_exports, {
  Logout: () => Logout
});
module.exports = __toCommonJS(userLogout_exports);
async function Logout(req, res) {
  return res.clearCookie("token", {
    path: "/"
    // Ensure the path matches the cookie path
  }).status(200).send({ message: "Logout successful" });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Logout
});
