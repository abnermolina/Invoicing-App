import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

//function
export async function updateInvoiceController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const updateInvoiceSchema = z.object({
    price: z.coerce.number().optional(),
    invoiceNum: z.string().optional(),
    serviceDescription: z.string().optional(),
    unit: z.string().optional(),
    createdAt: z.date().optional(),
  });

  const invoiceidSchema = z.object({
    invoiceid: z.string(),
  });

  const userid = req.user.sub;

  try {
    const { price, invoiceNum, serviceDescription, unit, createdAt } =
      updateInvoiceSchema.parse(req.body);

    const { invoiceid } = invoiceidSchema.parse(req.params);

    const updateInvoice = await prisma.invoice.update({
      where: {
        id: invoiceid,
        userId: userid,
      },
      data: {
        price,
        invoiceNum,
        serviceDescription,
        unit,
        createdAt,
      },
    });

    if (!updateInvoice) {
      return res.status(404).send({ message: "Invoice not found" });
    }

    return res.status(200).send({
      message: "Invoice information updated succesfully",
      invoice: updateInvoice,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Something went wrong" });
  }
}
