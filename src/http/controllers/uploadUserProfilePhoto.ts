import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv"; // dotenv for loading environment variables
import { v4 as uuidv4 } from "uuid"; // UUID generation
import path from "path"; // Node.js path module

export async function uploadProfilePhotoController(
  req: FastifyRequest, // Request object from Fastify
  res: FastifyReply // Reply object from Fastify
) {
  config();

  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET as string,
    },

    region: process.env.REGION as string,
  });

  const image = await req.file();

  const userid = req.user.sub;

  if (!image) {
    return res.status(400).send({ message: "No profile photo uploaded" });
  }

  // extract the file extension from the uploaded image filename
  const fileExtension = path.extname(image.filename);

  // generate a unique name for the uploaded file in S3
  const s3Key = `${uuidv4()}${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.PROFILE_PHOTO_S3_BUCKET_NAME as string,
    Key: s3Key, // Unique key (name) for the file in S3
    Body: image?.file, // Image data
    ContentType: image.mimetype, // Mime type of the image
  };

  await new Upload({
    client: s3,
    params: uploadParams,
  }).done();

  const updateUser = await prisma.user.update({
    where: {
      id: userid,
    },
    data: {
      userProfilePhoto: s3Key, // name of the uploaded file in S3
    },
  });

  return res
    .status(200)
    .send({ message: "Profile photo uploaded successfully", updateUser });
}
