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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

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
      signed: true
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
async function userRoutes(app2) {
  app2.post("/users", registerController);
  app2.get("/profile", { onRequest: [jwtAuthenticate] }, getUserProfile);
  app2.post("/login", Login);
  app2.delete("/users", { onRequest: [jwtAuthenticate] }, deleteUserController);
  app2.patch("/users", { onRequest: [jwtAuthenticate] }, updateUserController);
  app2.post("/logout", Logout);
}

// src/http/controllers/invoiceCreations.ts
var z4 = __toESM(require("zod"));
async function invoiceController(req, res) {
  const invoiceSchema = z4.object({
    price: z4.number(),
    invoiceNum: z4.string(),
    serviceDescription: z4.string(),
    unit: z4.string()
  });
  const buildingidSchema = z4.object({
    buildingid: z4.string()
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
var z5 = __toESM(require("zod"));
async function updateInvoiceController(req, res) {
  const updateInvoiceSchema = z5.object({
    price: z5.coerce.number().optional(),
    invoiceNum: z5.string().optional(),
    serviceDescription: z5.string().optional(),
    unit: z5.string().optional(),
    createdAt: z5.date().optional()
  });
  const invoiceidSchema = z5.object({
    invoiceid: z5.string()
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

// src/http/controllers/deleteInvoice.ts
var z6 = __toESM(require("zod"));
async function deleteInvoiceController(req, res) {
  const deleteInvoiceSchema = z6.object({
    invoiceid: z6.string()
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
async function invoiceRoutes(app2) {
  app2.post(
    "/invoices/:buildingid",
    { onRequest: [jwtAuthenticate] },
    invoiceController
  );
  app2.patch(
    "/invoices/:invoiceid",
    { onRequest: [jwtAuthenticate] },
    updateInvoiceController
  );
  app2.delete(
    "/invoices/:invoiceid",
    { onRequest: [jwtAuthenticate] },
    deleteInvoiceController
  );
}

// src/http/controllers/buildingCreation.ts
var z7 = __toESM(require("zod"));
async function buildingController(req, res) {
  const buildingSchema = z7.object({
    buildingName: z7.string(),
    address: z7.string()
  });
  const companyidSchema = z7.object({
    companyid: z7.string()
  });
  const userid = req.user.sub;
  const { buildingName, address } = buildingSchema.parse(req.body);
  const { companyid } = companyidSchema.parse(req.params);
  const building = await prisma.buildings.create({
    data: {
      buildingName,
      address,
      userId: userid,
      companyId: companyid
    }
  });
  return res.status(201).send(building);
}

// src/http/controllers/updateBuilding.ts
var z8 = __toESM(require("zod"));
async function updateBuildingController(req, res) {
  const updateBuildingSchema = z8.object({
    buildingName: z8.string().optional(),
    address: z8.string().optional()
  });
  const buildingidSchema = z8.object({
    buildingid: z8.string()
  });
  const userid = req.user.sub;
  try {
    const { buildingName, address } = updateBuildingSchema.parse(req.body);
    const { buildingid } = buildingidSchema.parse(req.params);
    const updateBuilding = await prisma.buildings.update({
      where: {
        id: buildingid,
        userId: userid
      },
      data: {
        buildingName,
        address
      }
    });
    if (!updateBuilding) {
      return res.status(404).send({ message: "Building not found" });
    }
    return res.status(200).send({
      message: "Building updated Succesfully",
      buildings: updateBuilding
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

// src/http/controllers/deleteBuilding.ts
var z9 = __toESM(require("zod"));
async function deleteBuildingController(req, res) {
  const deleteBuildingSchema = z9.object({
    buildingid: z9.string()
  });
  const userid = req.user.sub;
  try {
    const validatedData = deleteBuildingSchema.safeParse(req.params);
    if (!validatedData.success) {
      return res.status(400).send({ message: "Invalid request body" });
    }
    const { buildingid } = validatedData.data;
    const deletedBuilding = await prisma.buildings.delete({
      where: {
        id: buildingid,
        userId: userid
      }
    });
    if (!deletedBuilding) {
      return res.status(404).send({
        message: "Building not found"
      });
    }
    return res.status(200).send({
      message: "Building deleted succesfully",
      company: deletedBuilding
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

// src/routes/buildings.route.ts
async function buildingRoutes(app2) {
  app2.post(
    "/buildings/:companyid",
    { onRequest: [jwtAuthenticate] },
    buildingController
  );
  app2.patch(
    "/buildings/:buildingid",
    { onRequest: [jwtAuthenticate] },
    updateBuildingController
  );
  app2.delete(
    "/buildings/:buildingid",
    { onRequest: [jwtAuthenticate] },
    deleteBuildingController
  );
}

// src/http/controllers/companyCreation.ts
var z10 = __toESM(require("zod"));
async function companyController(req, res) {
  const companySchema = z10.object({
    companyName: z10.string(),
    companyAddress: z10.string()
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
var z11 = __toESM(require("zod"));
async function updateCompanyController(req, res) {
  const updateCompanySchema = z11.object({
    companyName: z11.string().optional(),
    companyAddress: z11.string().optional()
  });
  const companyidSchema = z11.object({
    companyid: z11.string()
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
var z12 = __toESM(require("zod"));
async function deleteCompanyController(req, res) {
  const deleteCompanySchema = z12.object({
    companyid: z12.string()
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
async function companyRoutes(app2) {
  app2.addHook("onRequest", jwtAuthenticate);
  app2.post("/company", companyController);
  app2.delete("/company/:companyid", deleteCompanyController);
  app2.patch("/company/:companyid", updateCompanyController);
  app2.patch("/company/logo/:companyid", uploadLogoController);
}

// src/app.ts
var import_jwt = __toESM(require("@fastify/jwt"));

// src/env/index.ts
var import_config = require("dotenv/config");
var z14 = __toESM(require("zod"));
var envSchema = z14.object({
  NODE_ENV: z14.enum(["dev", "production", "test"]).default("dev"),
  PORT: z14.coerce.number().default(3e3),
  SECRET_JWT: z14.string(),
  SECRET_COOKIE: z14.string()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("invalid Env Variables", _env.error.format());
  throw new Error("invalid Env Variables");
}
var env = _env.data;

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));
var import_multipart = __toESM(require("@fastify/multipart"));
var import_formbody = __toESM(require("@fastify/formbody"));
var import_cors = __toESM(require("@fastify/cors"));
var app = (0, import_fastify.default)();
app.register(import_multipart.default);
app.register(import_formbody.default);
app.register(import_cors.default, {
  origin: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true
});
app.register(userRoutes);
app.register(invoiceRoutes);
app.register(buildingRoutes);
app.register(companyRoutes);
app.register(import_cookie.default, { secret: env.SECRET_COOKIE });
app.register(import_jwt.default, {
  cookie: { cookieName: "token", signed: true },
  secret: env.SECRET_JWT
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
