import { deleteExpensesController } from "@/http/controllers/deleteExpenses";
import { expensesController } from "@/http/controllers/expensesCreation";
import { getExpensesController } from "@/http/controllers/getExpenses";
import { updateExpensesController } from "@/http/controllers/updateExpenses";
import { jwtAuthenticate } from "@/middlewares/authUser";
import fastify, { FastifyInstance } from "fastify";

export async function expensesRoutes(app: FastifyInstance) {
  app.post("/expenses/:companyid", { onRequest: [jwtAuthenticate] }, expensesController);
  app.patch(
    "/expenses/:expenseid",
    { onRequest: [jwtAuthenticate] },
    updateExpensesController
  );
  app.delete(
    "/expenses/:expenseid",
    { onRequest: [jwtAuthenticate] },
    deleteExpensesController
  );
  app.get("/expenses", { onRequest: [jwtAuthenticate] }, getExpensesController);
}
