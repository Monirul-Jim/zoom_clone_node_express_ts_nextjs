import express from "express";
import { RegisterRoutes } from "../modules/Register/register.routes";
import { LoginRoutes } from "../modules/Login/login.route";
import { MeetingRoutes } from "../modules/meeting/meeting.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: RegisterRoutes,
  },
  {
    path: "/auth",
    route: LoginRoutes,
  },
  {
    path: "/meeting",
    route: MeetingRoutes,
  },
  
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;