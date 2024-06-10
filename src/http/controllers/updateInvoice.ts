import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

//function
export async function updateInvoiceController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const updateInvoiceSchema = z.object({
    invoiceNum: z.number().optional(),
    unit: z.string().optional(),
    createdAt: z.date().optional(),
    customField: z.string().optional(),
    poBox: z.string().optional(),
    services: z.array(
      z.object({
        serviceName: z.string().optional(),
        price: z.number().optional(),
        serviceQuantity: z.number().optional(),
      })
    ),
  });

  const invoiceidSchema = z.object({
    invoiceid: z.string(),
  });

  const userid = req.user.sub;

  try {
    const { services, invoiceNum, customField, poBox, unit, createdAt } =
      updateInvoiceSchema.parse(req.body);

    const { invoiceid } = invoiceidSchema.parse(req.params);

    // how can i update multiple services at the same time?
    // chat gpt me an option but it passes the service id through the body

    if (services && services.length > 0) {
      for (const service of services) {
        await prisma.service.update({
          where: {
            serviceName: service.serviceName,
          },
          data: {
            serviceName: service.serviceName,
            price: service.price,
            serviceQuantity: service.serviceQuantity,
          },
        });
      }
    }

    const totalPrice = services.reduce((acc, service) => {
      if (
        service.price !== undefined &&
        service.serviceQuantity !== undefined
      ) {
        return acc + service.price * service.serviceQuantity;
      } else {
        return acc;
      }
    }, 0);

    const updateInvoice = await prisma.invoice.update({
      where: {
        id: invoiceid,
        userId: userid,
      },
      data: {
        invoiceNum,
        unit,
        createdAt,
        customField,
        poBox,
        totalPrice: totalPrice,
      },
      include: {
        services: true,
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
