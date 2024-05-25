import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string;
    }; // user type is the return type of `request.user` object
  }
}
