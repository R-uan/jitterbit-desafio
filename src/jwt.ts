import "dotenv/config";
import jwt from "jsonwebtoken";
import { exit } from "node:process";

const secret = process.env.JWT_SECRET ?? exit("AAAAAAAA");
console.log(secret);
export function generateToken(userId: string) {
  const token = jwt.sign({ userId }, secret, { expiresIn: "1h" });
  return token;
}
