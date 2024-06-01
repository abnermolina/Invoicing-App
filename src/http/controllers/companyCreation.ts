// companyCreation.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; // types
import * as z from "zod";

// function
export async function companyController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const companySchema = z.object({
    companyName: z.string(),
    companyAddress: z.string(),
  });

  const userid = req.user.sub;

  const { companyName, companyAddress } = companySchema.parse(req.body);

  const company = await prisma.company.create({
    data: {
      companyName,
      companyAddress,
      userId: userid,
      companyLogo: "",
    },
  });

  return res.status(201).send(company);
}

// add error for unique company name
// when company is deleted  also delete file from aws s3
// when company is updated also update file from aws s3
