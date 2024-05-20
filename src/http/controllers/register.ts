//register.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";
import { hash } from "bcryptjs";

// funtion
export async function registerController(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });
  const { email, name, password } = registerSchema.parse(req.body);

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  return res.status(201).send({ message: "User created successfully" });
}
