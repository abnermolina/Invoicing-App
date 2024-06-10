import fastify, { FastifyInstance } from "fastify";
import { invoiceController } from "@/http/controllers/invoiceCreations";
import { updateInvoiceController } from "@/http/controllers/updateInvoice";
import { jwtAuthenticate } from "@/middlewares/authUser";
import { deleteInvoiceController } from "@/http/controllers/deleteInvoice";
import { getInvoiceController } from "@/http/controllers/getInvoice";

export async function invoiceRoutes(app: FastifyInstance) {
  app.post(
    "/invoices/:buildingid",
    { onRequest: [jwtAuthenticate] },
    invoiceController
  );
  app.patch(
    "/invoices/:invoiceid",
    { onRequest: [jwtAuthenticate] },
    updateInvoiceController
  );
  app.delete(
    "/invoices/:invoiceid",
    { onRequest: [jwtAuthenticate] },
    deleteInvoiceController
  );
  app.get("/invoices", { onRequest: [jwtAuthenticate] }, getInvoiceController);
}
