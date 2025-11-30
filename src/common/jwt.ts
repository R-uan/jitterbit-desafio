import "dotenv/config";
import jwt from "jsonwebtoken";
import { exit } from "node:process";

let secret: string;

export function getSecret() {
  const env = process.env.JWT_SECRET;
  if (!env) {
    console.error("[ERROR]: JWT_SECRET env not set.");
    return exit(1);
  }
  secret = env;
}

export function generateToken(userId: string) {
  const token = jwt.sign({ userId }, secret!, { expiresIn: "1h" });
  return token;
}
