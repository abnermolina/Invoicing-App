import fastify, { FastifyInstance } from "fastify";
import { registerController } from "@/http/controllers/register";
import { getUserProfile } from "@/http/controllers/getUserProfile";
import { Login } from "@/http/controllers/userLogin";
import { deleteUserController } from "@/http/controllers/deleteUser";
import { updateUserController } from "@/http/controllers/updateUserInfo";
import { jwtAuthenticate } from "@/middlewares/authUser";
import { Logout } from "@/http/controllers/userLogout";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", registerController);
  app.get("/profile", { onRequest: [jwtAuthenticate] }, getUserProfile);
  app.post("/login", Login);
  app.delete("/users", { onRequest: [jwtAuthenticate] }, deleteUserController);
  app.patch("/users", { onRequest: [jwtAuthenticate] }, updateUserController);
  app.post("/logout", Logout);
}
