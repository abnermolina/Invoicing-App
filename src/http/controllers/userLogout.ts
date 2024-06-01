import { FastifyReply, FastifyRequest } from "fastify";

export async function Logout(req: FastifyRequest, res: FastifyReply) {
  return res
    .clearCookie("token", {
      path: "/", // Ensure the path matches the cookie path
    })
    .status(200)
    .send({ message: "Logout successful" });
}
