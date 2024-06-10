//invoiceCreation.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

// funtion
export async function invoiceController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const invoiceSchema = z.object({
    invoiceNum: z.number().nonnegative().optional(),
    unit: z.string(),
    createdAt: z.date().optional(),
    customField: z.string().optional(),
    poBox: z.string().optional(),
    serviceDescription: z.string().optional(),
    services: z.array(
      z.object({
        serviceName: z.string(),
        price: z.number(),
        serviceQuantity: z.number(),
      })
    ),
  });

  const buildingidSchema = z.object({
    buildingid: z.string(),
  });

  const { buildingid } = buildingidSchema.parse(req.params);

  const {
    invoiceNum,
    customField,
    unit,
    createdAt,
    services,
    poBox,
    serviceDescription,
  } = invoiceSchema.parse(req.body);

  const userid = req.user.sub;

  // sum all the prices in the services array
  const totalPrice = services.reduce(
    (acc, service) => acc + service.price * service.serviceQuantity,
    0
  );

  let newInvoiceNum;

  // if the user input an invoice number then check if it already exists
  if (invoiceNum !== undefined) {
    const existingNum = await prisma.invoice.findFirst({
      where: {
        buildingsId: buildingid,
        userId: userid,
        invoiceNum: invoiceNum,
      },
    });
    if (existingNum?.invoiceNum) {
      return res.status(400).send({
        message: "Invoice number already exists",
      });
    }
    // If the number does not already exist use the provided invoice number
    newInvoiceNum = invoiceNum;
  } else {
    // Retrieve the latest invoice number and increment it by 1
    const latestInvoice = await prisma.invoice.findFirst({
      orderBy: {
        invoiceNum: "desc",
      },
    });
    newInvoiceNum = latestInvoice ? latestInvoice.invoiceNum + 1 : 1;
  }

  const invoice = await prisma.invoice.create({
    data: {
      customField,
      invoiceNum: newInvoiceNum,
      unit,
      poBox,
      createdAt,
      serviceDescription,
      userId: userid,
      buildingsId: buildingid,
      totalPrice: totalPrice,
      services: {
        //  create multiple service records associated with a single invoice
        create: services.map((services) => ({
          serviceName: services.serviceName,
          price: services.price,
          serviceQuantity: services.serviceQuantity,
        })),
      },
    },
    include: {
      services: true,
    },
  });

  return res.status(201).send(invoice);
}
