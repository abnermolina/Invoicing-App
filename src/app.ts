//APP.TS
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "./routes/user.routes";
import { invoiceRoutes } from "./routes/invoice.routes";
import { buildingRoutes } from "./routes/buildings.route";
import { companyRoutes } from "./routes/company.route";

export const app = fastify();

app.register(userRoutes);
app.register(invoiceRoutes);
app.register(buildingRoutes);
app.register(companyRoutes);
