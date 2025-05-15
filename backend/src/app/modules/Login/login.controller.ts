import config from "../../config/config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LoginServices } from "./login.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await LoginServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;
  // res.cookie("refreshToken", refreshToken, {
  //   secure: config.node_env === "production",
  //   httpOnly: true,
  //   sameSite: "none",
  //   maxAge: 1000 * 60 * 60 * 24 * 365,
  // });
res.cookie("refreshToken", refreshToken, {
  secure: config.node_env === "production", 
  httpOnly: true,
  sameSite: config.node_env === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 365,
});

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in successfully!",
    data: {
      accessToken,
    },
  });
});



export const LoginController = {
  loginUser,
};