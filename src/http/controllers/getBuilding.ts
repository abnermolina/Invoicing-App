import { prisma } from "@/lib/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const getBuildingQuerySchema = z.object({
  page: z.string().optional().transform(Number),
  pageSize: z.string().optional().transform(Number),
  companyId: z.string().optional(),
});

export async function getBuildingController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  try {
    const { data, success, error } = getBuildingQuerySchema.safeParse(
      req.query
    );

    if (!success) {
      res.status(400).send({
        message: "Invalid query parameters",
        errors: error.issues,
      });
    }

    const pageSize = data?.pageSize || 10; // Safely
    const userId = req.user.sub;
    const page = data?.page || 1; // Safely cast the query parameter to a string
    const skip = (page - 1) * pageSize;

    const companyId = data?.companyId;

    const buildings = await prisma.buildings.findMany({
      where: { companyId: companyId, userId: userId },
      skip: skip,
      take: pageSize,
      orderBy: { buildingName: "asc" },
    });

    if (buildings.length === 0) {
      return res.status(404).send({
        message: "This user does not have any buildings",
      });
    }

    return res.status(200).send({
      page: page,
      totalPages: skip,
      buildings: buildings,
    });
  } catch (err) {
    return res.status(404).send({
      message: "Building not found",
    });
  }
}
