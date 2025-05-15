// import jwt, { JwtPayload } from "jsonwebtoken";

// export const createToken = (
//   jwtPayload: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: string;
//   },
//   secret: string,
//   expiresIn: string
// ) => {
//   return jwt.sign(jwtPayload, secret, {
//     expiresIn,
//   });
// };

// export const verifyToken = (token: string, secret: string) => {
//   return jwt.verify(token, secret) as JwtPayload;
// };

import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

interface TokenPayload {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const createToken = (
  jwtPayload: TokenPayload,
  secret: jwt.Secret,
  expiresIn: string
) => {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: jwt.Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
