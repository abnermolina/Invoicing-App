//APP.TS
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "./routes/user.routes";
import { invoiceRoutes } from "./routes/invoice.routes";

export const app = fastify();

app.register(userRoutes);
app.register(invoiceRoutes);
