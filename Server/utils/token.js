import jwt from "jsonwebtoken";
import { jwtExpiresIn, jwtSecret } from "../config/env.js";

/* -------- Generate jwt token -------- */
export const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );
};
