import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";
import dotenv from "dotenv";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// funtion
export async function deleteCompanyController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  dotenv.config();

  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET as string,
    },
    region: process.env.REGION as string,
  });

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

    const logo = await prisma.company.findUnique({
      where: {
        
        id: companyid,
        userId: userid,
      },
      select: {
        companyLogo: true,
        id: false,
        companyAddress: false,
        companyName: false,
        userId: false,
        Buildings: false,
      },
    });

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: logo?.companyLogo,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    const deleteCompany = await prisma.company.delete({
      where: {
        id: companyid,
        userId: userid,
      },
    });

    if (!deleteCompany) {
      return res.status(404).send({
        message: "Company not found",
      }); // error message not currently working
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
