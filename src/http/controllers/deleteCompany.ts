import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

// funtion
export async function deleteCompanyController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const deleteCompanySchema = z.object({
    companyid: z.string(),
  });

  const userid = req.user.sub;

  try {
    const validatedData = deleteCompanySchema.safeParse(req.params);

    if (!validatedData.success) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { companyid } = validatedData.data;

    const deleteCompany = await prisma.company.delete({
      where: {
        id: companyid,
        userId: userid,
      },
    });

    if (!deleteCompany) {
      return res.status(404).send({
        message: "Company not found",
      });
    }
    return res.status(200).send({
      message: "Company deleted succesfully",
      company: deleteCompany,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Something went wrong" });
  }
}
