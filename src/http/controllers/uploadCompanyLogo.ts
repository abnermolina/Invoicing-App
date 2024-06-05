// uploadCompanyLogo.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { S3 } from "aws-sdk"; // AWS SDK for interacting with S3
import { config } from "dotenv"; // dotenv for loading environment variables
import { v4 as uuidv4 } from "uuid"; // UUID generation
import path from "path"; // Node.js path module

export async function uploadLogoController(
  req: FastifyRequest, // Request object from Fastify
  res: FastifyReply // Reply object from Fastify
) {
  config(); // Load environment variables from .env file

  const s3 = new S3({
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET as string,
    region: process.env.REGION as string,
  });

  // Define a schema for the data expected in the request parameters
  const uploadDataSchema = z.object({
    companyid: z.string(),
  });

  const { companyid } = uploadDataSchema.parse(req.params);

  // Retrieve the uploaded image from the request
  const image = await req.file();

  const userid = req.user.sub;

  if (!image) {
    return res.status(400).send({ message: "No logo uploaded" });
  }

  // Extract the file extension from the uploaded image filename
  const fileExtension = path.extname(image.filename);

  // Generate a unique key for the uploaded file in S3
  const s3Key = `${uuidv4()}${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: s3Key, // Unique key (name) for the file in S3
    Body: image?.file, // Image data
    ContentType: image.mimetype, // Mime type of the image
  };

  // Upload the image to S3 and await the response
  await s3.upload(uploadParams).promise();

  const updateCompany = await prisma.company.update({
    where: {
      id: companyid, // Company ID
      userId: userid, // User ID
    },
    data: {
      companyLogo: s3Key, // name of the uploaded file in S3
    },
  });

  return res
    .status(200)
    .send({ message: "Logo uploaded successfully", updateCompany });
}
