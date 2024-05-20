//getUserProfile.ts
import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify"; //types
import * as z from "zod";

export async function getUserProfile(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  const profileSchema = z.object({
    userid: z.string(),
  });
  const { userid } = profileSchema.parse(req.params);

  const user = await prisma.user.findUnique({
    where: {
      id: userid,
    },
  });
  return res.status(200).send({
    user: user,
  });
}
