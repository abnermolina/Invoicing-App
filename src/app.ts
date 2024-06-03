//APP.TS
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "./routes/user.routes";
import { invoiceRoutes } from "./routes/invoice.routes";
import { buildingRoutes } from "./routes/buildings.route";
import { companyRoutes } from "./routes/company.route";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env/index";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import fastifyFormBody from "@fastify/formbody";
import cors from "@fastify/cors";

export const app = fastify();

app.register(fastifyMultipart);
app.register(fastifyFormBody);

app.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
});

app.register(userRoutes);
app.register(invoiceRoutes);
app.register(buildingRoutes);
app.register(companyRoutes);

app.register(fastifyCookie, { secret: env.SECRET_COOKIE });

app.register(fastifyJwt, {
  cookie: { cookieName: "token", signed: true },
  secret: env.SECRET_JWT,
});
