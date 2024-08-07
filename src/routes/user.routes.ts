import fastify, { FastifyInstance } from "fastify";
import { registerController } from "@/http/controllers/register";
import { getUserProfile } from "@/http/controllers/getUserProfile";
import { Login } from "@/http/controllers/userLogin";
import { deleteUserController } from "@/http/controllers/deleteUser";
import { updateUserController } from "@/http/controllers/updateUserInfo";
import { jwtAuthenticate } from "@/middlewares/authUser";
import { Logout } from "@/http/controllers/userLogout";
import { uploadProfilePhotoController } from "@/http/controllers/uploadUserProfilePhoto";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", registerController);
  app.patch(
    "/users/photos",
    { onRequest: [jwtAuthenticate] },
    uploadProfilePhotoController
  );
  app.get("/profile", { onRequest: [jwtAuthenticate] }, getUserProfile);
  app.post("/login", Login);
  app.delete("/users", { onRequest: [jwtAuthenticate] }, deleteUserController);
  app.patch("/users", { onRequest: [jwtAuthenticate] }, updateUserController);
  app.post("/logout", Logout); // does it need to be protected? no
}
