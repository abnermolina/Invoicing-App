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

    const token = await res.jwtSign(
      {},
      {
        sign: {
          sub: loginUser?.id,
        },
      }
    );

    const passwordMatch = await bcrypt.compare(
      password,
      loginUser?.password || ""
    );

    if (!loginUser) {
      return res.status(401).send({ message: "Incorrect email" });
    }
    if (!passwordMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    return res
      .status(200)
      .setCookie("token", token, {
        path: "/",
        secure: true, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .send({ token });
  } catch (error) {
    console.log(error);
  }
}
