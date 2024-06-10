import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

//function
export async function updateBuildingController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const updateBuildingSchema = z.object({
    buildingName: z.string().optional(),
    address: z.string().optional(),
    letterIdBuilding: z.string().optional(),
  });

  const buildingidSchema = z.object({
    buildingid: z.string(),
  });

  const userid = req.user.sub;

  try {
    const { buildingName, address, letterIdBuilding } =
      updateBuildingSchema.parse(req.body);

    const { buildingid } = buildingidSchema.parse(req.params);

    const updateBuilding = await prisma.buildings.update({
      where: {
        id: buildingid,
        userId: userid,
      },
      data: {
        buildingName,
        address,
        letterIdBuilding,
      },
    });

    if (!updateBuilding) {
      return res.status(404).send({ message: "Building not found" });
    }

    return res.status(200).send({
      message: "Building updated Succesfully",
      buildings: updateBuilding,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Something went wrong" });
  }
}
