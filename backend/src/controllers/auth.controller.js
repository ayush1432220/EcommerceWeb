import crypto from "crypto";
import { env } from "../config/env.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOpaqueToken, safeEqualStrings, sha256 } from "../utils/crypto.js";
import { sendEmail } from "../utils/email.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

const buildAuthResponse = (user, accessToken, refreshToken) => ({
  success: true,
  message: "Authentication successful",
  data: {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  }
});

const issueRefreshToken = async (user, req, family = crypto.randomUUID()) => {
  const jti = crypto.randomUUID();
  const refreshToken = signRefreshToken({
    sub: user._id.toString(),
    jti,
    family
  });

  const decoded = verifyRefreshToken(refreshToken);

  await RefreshToken.create({
    user: user._id,
    tokenHash: sha256(refreshToken),
    jti,
    family,
    expiresAt: new Date(decoded.exp * 1000),
    createdByIp: req.ip,
    userAgent: req.get("user-agent") || "unknown"
  });

  return refreshToken;
};

const issueEmailVerification = async (user) => {
  const token = generateOpaqueToken(32);
  user.emailVerificationTokenHash = sha256(token);
  user.emailVerificationExpiresAt = new Date(
    Date.now() + env.EMAIL_VERIFY_TOKEN_TTL_MINUTES * 60 * 1000
  );
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: `Use this token to verify your account: ${token}`
  });
};

const issuePasswordReset = async (user) => {
  const token = generateOpaqueToken(32);
  user.passwordResetTokenHash = sha256(token);
  user.passwordResetExpiresAt = new Date(
    Date.now() + env.PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000
  );
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    text: `Use this token to reset your password: ${token}`
  });
};

export const register = asyncHandler(async (req, res) => {
  console.log("Registering user with email:", req.body.email);
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new ApiError(409, "Unable to create account");
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  await issueEmailVerification(user);

  res.status(201).json({
    success: true,
    message: "Registration successful. Check your email for verification instructions."
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const tokenHash = sha256(req.body.token);

  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpiresAt: { $gt: new Date() }
  }).select("+emailVerificationTokenHash +emailVerificationExpiresAt");

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.isVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpiresAt = null;
  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully"
  });
});

export const login = asyncHandler(async (req, res) => {
  console.log("Attempting login for email:", req.body.email);
  const user = await User.findOne({ email: req.body.email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(req.body.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user, req);

  res.json(buildAuthResponse(user, accessToken, refreshToken));
});

export const logout = asyncHandler(async (req, res) => {
  const tokenHash = sha256(req.body.refreshToken);
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

export const refresh = asyncHandler(async (req, res) => {
  let payload;
  try {
    payload = verifyRefreshToken(req.body.refreshToken);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const storedToken = await RefreshToken.findOne({ jti: payload.jti });
  const incomingTokenHash = sha256(req.body.refreshToken);

  // Revoke the whole token family on reuse or mismatch to contain stolen refresh tokens.
  if (!storedToken || !safeEqualStrings(storedToken.tokenHash, incomingTokenHash)) {
    await RefreshToken.updateMany(
      { family: payload.family, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
    throw new ApiError(401, "Invalid refresh token");
  }

  if (storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(payload.sub).select("name email role isVerified createdAt");
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newRefreshToken = await issueRefreshToken(user, req, storedToken.family);
  storedToken.revokedAt = new Date();
  storedToken.replacedByTokenHash = sha256(newRefreshToken);
  await storedToken.save();

  const accessToken = signAccessToken(user);

  res.json(buildAuthResponse(user, accessToken, newRefreshToken));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+passwordResetTokenHash +passwordResetExpiresAt"
  );

  if (user) {
    await issuePasswordReset(user);
  }

  res.json({
    success: true,
    message: "If the account exists, password reset instructions have been sent."
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const tokenHash = sha256(req.body.token);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() }
  }).select("+passwordResetTokenHash +passwordResetExpiresAt +password");

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = req.body.password;
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;
  user.passwordChangedAt = new Date();
  await user.save();

  await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { $set: { revokedAt: new Date() } });

  res.json({
    success: true,
    message: "Password reset successful. Please log in again."
  });
});
