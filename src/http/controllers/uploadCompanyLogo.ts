// uploadCompanyLogo.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { S3 } from "aws-sdk"; // AWS SDK for interacting with S3
import { config } from "dotenv"; // dotenv for loading environment variables
import { v4 as uuidv4 } from "uuid"; // UUID generation
import path from "path"; // Node.js path module

// Define an asynchronous function to handle logo uploads
export async function uploadLogoController(
  req: FastifyRequest, // Request object from Fastify
  res: FastifyReply // Reply object from Fastify
) {
  config(); // Load environment variables from .env file

  // Create an S3 instance with AWS credentials from environment variables
  const s3 = new S3({
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET as string,
    region: process.env.REGION as string,
  });

  // Define a schema for the data expected in the request parameters
  const uploadDataSchema = z.object({
    companyid: z.string(), // Expecting a string for company ID
  });

  // Parse the request parameters according to the defined schema
  const { companyid } = uploadDataSchema.parse(req.params);

  // Retrieve the uploaded image from the request
  const image = await req.file();

  // Get the user ID from the request object
  const userid = req.user.sub;

  // If no image is uploaded, throw an error
  if (!image) {
    return res.status(400).send({ message: "No logo uploaded" });
  }

  // Extract the file extension from the uploaded image filename
  const fileExtension = path.extname(image.filename);

  // Generate a unique key for the uploaded file in S3
  const s3Key = `${uuidv4()}${fileExtension}`;

  // Define parameters for uploading the image to S3
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME as string, // Bucket name from environment variables
    Key: s3Key, // Unique key for the file in S3
    Body: image?.file, // Image data
    ContentType: image.mimetype, // Mime type of the image
  };

  // Upload the image to S3 and await the response
  const s3Response = await s3.upload(uploadParams).promise();

  // Update the company record in the database with the S3 URL of the uploaded logo
  const updateCompany = await prisma.company.update({
    where: {
      id: companyid, // Company ID
      userId: userid, // User ID
    },
    data: {
      companyLogo: s3Response.Location, // URL of the uploaded logo in S3
    },
  });

  // Send a success response with a message and the updated company data
  return res
    .status(200)
    .send({ message: "Logo uploaded successfully", updateCompany });
}
