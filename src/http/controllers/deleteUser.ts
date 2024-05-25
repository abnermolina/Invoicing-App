import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

// funtion

export async function deleteUserController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  try {
    const userid = req.user.sub;

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
