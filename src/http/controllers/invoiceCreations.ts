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
    price: z.number(),
    invoiceNum: z.string(),
    serviceDescription: z.string(),
    unit: z.string(),
  });

  const buildingNameSchema = z.object({
    buildingName: z.string(),
  });

  const useridSchema = z.object({
    userid: z.string(),
  });

  const { buildingName } = buildingNameSchema.parse(req.body);

  const { userid } = useridSchema.parse(req.params);

  const { price, invoiceNum, serviceDescription, unit } = invoiceSchema.parse(
    req.body
  );

  const building = await prisma.user.findUnique({
    where: { id: userid },
    select: { Buildings: true },
  });

  const invoice = await prisma.invoice.create({
    data: {
      price,
      invoiceNum,
      serviceDescription,
      unit,
      userId: userid,
      buildingsId: building.Buildings.map((building) => building.id),
    },
  });

  return res.status(201).send(invoice);
}
