import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import dotenv from "dotenv";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// funtion

export async function deleteUserController(
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

  try {
    const userid = req.user.sub;

    const profilePhoto = await prisma.user.findUnique({
      where: {
        id: userid,
      },
      select: {
        userProfilePhoto: true,
      },
    });

    if (!profilePhoto?.userProfilePhoto) {
      return res.status(404).send({ message: "No profile photo found" });
    }

    const params = {
      Bucket: process.env.PROFILE_PHOTO_S3_BUCKET_NAME as string,
      Key: profilePhoto?.userProfilePhoto,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    const deletedUser = await prisma.user.delete({
      where: {
        id: userid,
      },
    });

    if (!deletedUser) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    return res
      .status(200)
      .send({ message: "User deleted succesfully", user: deletedUser });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Something went wrong" });
  }
}
