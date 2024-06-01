import { FastifyReply, FastifyRequest } from "fastify";

export async function jwtAuthenticate(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}
