//APP.TS
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "./routes/user.routes";
import { invoiceRoutes } from "./routes/invoice.routes";
import { buildingRoutes } from "./routes/buildings.route";
import { companyRoutes } from "./routes/company.route";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env/index";
import fastifyCookie from "@fastify/cookie";

export const app = fastify();

app.register(userRoutes);
app.register(invoiceRoutes);
app.register(buildingRoutes);
app.register(companyRoutes);

app.register(fastifyJwt, {
  secret: env.SECRET_JWT,
});

app.register(fastifyCookie, {
  secret: env.SECRET_COOKIE,
});
