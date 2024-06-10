import { prisma } from "@/lib/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

// Define the QueryParams interface
const getInvoicesQuerySchema = z.object({
  page: z.string().optional().transform(Number),
  pageSize: z.string().optional().transform(Number),
  buildingId: z.string().optional(),
});

export async function getInvoiceController(
  req: FastifyRequest, // Specify the types for query parameters
  res: FastifyReply // Type for the response object from Fastify
) {
  try {
    const { data, success, error } = getInvoicesQuerySchema.safeParse(
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

    const buildingId = data?.buildingId;

    const invoices = await prisma.invoice.findMany({
      where: { buildingsId: buildingId, userId: userId },
      skip: skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    if (invoices.length === 0) {
      return res.status(404).send({
        message: "Invoices not found",
      });
    }

    return res.status(200).send({
      page: page,
      totalPages: skip,
      invoices: invoices,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "An error occurred",
    });
  }
}
