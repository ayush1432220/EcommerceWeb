import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authorization.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findById(payload.sub).select("name email role isVerified createdAt");

  if (!user) {
    throw new ApiError(401, "Authentication required");
  }

  req.user = user;
  return next();
});
