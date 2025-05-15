import express from "express";
import { LoginController } from "./login.controller";

const router = express.Router();

router.post(
  "/login",
  //   validateRequest(AuthValidation.loginValidationSchema),
  LoginController.loginUser
);

export const LoginRoutes = router;