//getUserProfile.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types

export async function getUserProfile(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const userid = req.user.sub;

  const user = await prisma.user.findUnique({
    where: {
      id: userid,
    },
    select: {
      id: true,
      email: true,
      name: true,
      Buildings: true,
      Invoice: true,
      Company: true,
      // exclude the password field
      password: false,
    },
    
  });
  return res.status(200).send({
    user: user,
  });
}
