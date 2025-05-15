
import bcrypt from "bcrypt";
import { createToken } from "./login.utils";
import config from "../../config/config";
import { RegistrationModel } from "../Register/register.model";
import AppError from "../../errors/AppErrors";
import { TUserLogin } from "./login.interface";
const loginUser = async (payload: TUserLogin) => {
  const { email, password } = payload;

  const user = await RegistrationModel.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const userIsDeleted = user?.isDeleted;
  if (userIsDeleted) {
    throw new AppError(403, "This user is deleted");
  }
  const isUserBlocked = user?.status;
  if (isUserBlocked === "blocked") {
    throw new AppError(403, "This user is blocked by admin");
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Your password does not match");
  }
  const jwtPayload = {
    _id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const LoginServices = {
  loginUser,
};