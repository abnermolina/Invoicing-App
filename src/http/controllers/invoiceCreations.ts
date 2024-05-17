//register.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";
import { hash } from "bcryptjs";

// funtion
export async function invoiceController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const invoiceSchema = z.object({
    buildingName: z.string(),
    price: z.number(),
    address: z.string(),
    invoiceNum: z.string(),
    serviceDescription: z.string(),
    unit: z.string(),
  });
  const { buildingName, price, address, invoiceNum, serviceDescription, unit } =
    invoiceSchema.parse(req.body);

  const invoice = await prisma.invoice.create({
    data: {
      buildingName,
      price,
      address,
      invoiceNum,
      serviceDescription,
      unit,
    },
  });
  return res.status(201).send(invoice);
}
