import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

// funtion
export async function deleteBuildingController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const deleteBuildingSchema = z.object({
    buildingid: z.string(),
  });

  const userid = req.user.sub;

  try {
    const validatedData = deleteBuildingSchema.safeParse(req.params);

    if (!validatedData.success) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { buildingid } = validatedData.data;

    const deletedBuilding = await prisma.buildings.delete({
      where: {
        id: buildingid,
        userId: userid,
      },
    });

    if (!deletedBuilding) {
      return res.status(404).send({
        message: "Building not found",
      });
    }
    return res.status(200).send({
      message: "Building deleted succesfully",
      company: deletedBuilding,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Something went wrong" });
  }
}
