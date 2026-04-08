import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { env } from "../config/env.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
      select: false
    },
    emailVerificationExpiresAt: {
      type: Date,
      default: null,
      select: false
    },
    passwordResetTokenHash: {
      type: String,
      default: null,
      select: false
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null,
      select: false
    },
    passwordChangedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUNDS);
  this.passwordChangedAt = new Date();
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
