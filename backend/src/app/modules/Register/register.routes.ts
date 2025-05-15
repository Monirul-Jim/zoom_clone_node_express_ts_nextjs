import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { userRegistrationValidationSchema } from "./register.validation";
import { registerController } from "./register.controller";
const router = express.Router();
router.post(
  "/register",
  validateRequest(
    userRegistrationValidationSchema.createUserRegistrationValidationSchema
  ),

  registerController.createUserIntoDB
);
router.patch(
  "/:userId/isDeleted",
  validateRequest(userRegistrationValidationSchema.updateIsDeletedSchema),
  registerController.updateIsDeletedController
);

// Update role
router.patch(
  "/:userId/role",
  validateRequest(userRegistrationValidationSchema.updateRoleSchema),
  registerController.updateRoleController
);

// Update status
router.patch(
  "/:userId/status",
  validateRequest(userRegistrationValidationSchema.updateStatusSchema),
  registerController.updateStatusController
);

export const RegisterRoutes = router;