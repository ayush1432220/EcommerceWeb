import crypto from "crypto";

export const generateOpaqueToken = (bytes = 48) => crypto.randomBytes(bytes).toString("hex");

export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

export const safeEqualStrings = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};
