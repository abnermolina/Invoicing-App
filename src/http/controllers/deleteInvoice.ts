import { prisma } from "@/lib/prisma";
import { error } from "console";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

// funtion
export async function deleteInvoiceController(
  req: FastifyRequest,
  res: FastifyReply
) {
  const deleteInvoiceSchema = z.object({
    invoiceid: z.string(),
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
        userId: userid,
      },
    });

    if (!deleteInvoice) {
      return res.status(404).send({
        message: "Invoice not found",
      });
    }
    return res.status(200).send({
      message: "Invoice deleted succesfully",
      invoice: deleteInvoice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}
