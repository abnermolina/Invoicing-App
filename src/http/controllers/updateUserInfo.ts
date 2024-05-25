import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";
import { hash } from "bcryptjs";

//function
export async function updateUserController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
  });

  const userid = req.user.sub;

  try {
    const { name, email, password } = updateUserSchema.parse(req.body);

    const hashedPassword = await hash(password!, 10); // password! notes that it is not null

    const updateUser = await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!updateUser) {
      return res.status(404).send({ message: "User not found" });
    }

    return res
      .status(200)
      .send({ message: "User updated Succesfully", user: updateUser });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Something went wrong" });
  }
}
