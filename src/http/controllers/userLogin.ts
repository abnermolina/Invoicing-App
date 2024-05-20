//userLogin.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";
import bcrypt from "bcryptjs";

export async function Login(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  const { email, password } = loginSchema.parse(req.body);
  try {
    const loginUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const passwordMatch = await bcrypt.compare(
      password,
      loginUser?.password || ""
    );

    if (!loginUser) {
      return res.status(401).send({ message: "user" });
    }
    if (!passwordMatch) {
      return res.status(401).send({ message: "pass" });
    }

    return res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
  }
}
