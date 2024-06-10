import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

//function
export async function updateCompanyController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const updateCompanySchema = z.object({
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    companyEmail: z.string().email().optional(),
  });

  const companyidSchema = z.object({
    companyid: z.string(),
  });

  const userid = req.user.sub;

  try {
    const { companyName, companyAddress, companyEmail } =
      updateCompanySchema.parse(req.body);

    const { companyid } = companyidSchema.parse(req.params);

    const updateCompany = await prisma.company.update({
      where: {
        id: companyid,
        userId: userid,
      },
      data: {
        companyName,
        companyAddress,
        companyEmail,
      },
    });

    if (!updateCompany) {
      return res.status(404).send({ message: "Company not found" });
    }

    return res.status(200).send({
      message: "Company information updated succesfully",
      company: updateCompany,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Something went wrong" });
  }
}
