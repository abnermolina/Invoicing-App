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

// src/routes/user.routes.ts
var user_routes_exports = {};
__export(user_routes_exports, {
  userRoutes: () => userRoutes
});
module.exports = __toCommonJS(user_routes_exports);

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

// src/http/controllers/getUserProfile.ts
async function getUserProfile(req, res) {
  const userid = req.user.sub;
  const user = await prisma.user.findUnique({
    where: {
      id: userid
    },
    include: { Buildings: true, Invoice: true, Company: true }
  });
  return res.status(200).send({
    user
  });
}

// src/http/controllers/userLogin.ts
var z2 = __toESM(require("zod"));
var import_bcryptjs2 = __toESM(require("bcryptjs"));
async function Login(req, res) {
  const loginSchema = z2.object({
    email: z2.string().email(),
    password: z2.string()
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
    const passwordMatch = await import_bcryptjs2.default.compare(
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
      signed: true,
      secure: process.env.NODE_ENV === "production"
    }).send({ message: "Login successful" });
  } catch (error) {
    console.log(error);
  }
}

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

// src/http/controllers/updateUserInfo.ts
var z3 = __toESM(require("zod"));
var import_bcryptjs3 = require("bcryptjs");
async function updateUserController(req, res) {
  const updateUserSchema = z3.object({
    name: z3.string().optional(),
    email: z3.string().email().optional(),
    password: z3.string().optional()
  });
  const userid = req.user.sub;
  try {
    const { name, email, password } = updateUserSchema.parse(req.body);
    const hashedPassword = await (0, import_bcryptjs3.hash)(password, 10);
    const updateUser = await prisma.user.update({
      where: {
        id: userid
      },
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    if (!updateUser) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({ message: "User updated Succesfully", user: updateUser });
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

// src/http/controllers/userLogout.ts
async function Logout(req, res) {
  return res.clearCookie("token", {
    path: "/"
    // Ensure the path matches the cookie path
  }).status(200).send({ message: "Logout successful" });
}

// src/routes/user.routes.ts
async function userRoutes(app) {
  app.post("/users", registerController);
  app.get("/profile", { onRequest: [jwtAuthenticate] }, getUserProfile);
  app.post("/login", Login);
  app.delete("/users", { onRequest: [jwtAuthenticate] }, deleteUserController);
  app.patch("/users", { onRequest: [jwtAuthenticate] }, updateUserController);
  app.post("/logout", Logout);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRoutes
});
