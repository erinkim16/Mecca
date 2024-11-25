import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { parse } from "path";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function generateAccessToken(obj) {
  return jwt.sign(obj, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
}

export function generateRefreshToken(obj) {
  return jwt.sign(obj, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token) {
  if (!token?.startsWith("Bearer ")) {
    return null;
  }

  token = token.split(" ")[1];

  try {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.error("authentication: not verified");
    return null;
  }
}

export function verifyRefreshToken(token) {
  if (!token?.startsWith("Bearer ")) {
    return null;
  }

  token = token.split(" ")[1];

  try {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error("Refresh token verification error:", error);
    return null;
  }
}
