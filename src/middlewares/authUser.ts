import { FastifyReply, FastifyRequest } from "fastify";

export async function jwtAuthenticate(
  req: FastifyRequest, // type to req work from fastify
  res: FastifyReply // type for res to work
) {
  try {
    await req.jwtVerify();
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}
