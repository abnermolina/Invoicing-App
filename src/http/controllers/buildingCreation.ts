//buildingCreation.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

// function
export async function buildingController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const buildingSchema = z.object({
    buildingName: z.string(),
    address: z.string(),
  });

  const userid = req.user.sub;

  const { buildingName, address } = buildingSchema.parse(req.body);

  const building = await prisma.buildings.create({
    data: {
      buildingName,
      address,
      userId: userid,
    },
  });

  return res.status(201).send(building);
}
