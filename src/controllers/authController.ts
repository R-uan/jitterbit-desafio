import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { Request, Response } from "express";
import { signInSchema, signUpSchema } from "../validators";
import { UserRepository } from "../database/userRepository";
import { PrismaClientKnownRequestError } from "../database/prisma/generated/internal/prismaNamespace";

export class AuthenticationController {
  /**
   * Authenticates a user and returns a JWT token.
   * Validates credentials, compares password hash, and generates JWT on success.
   */
  public static async signIn(req: Request, res: Response) {
    try {
      const validData = signInSchema.parse(req.body);
      const user = await UserRepository.findUserByEmail(validData.email);
      if (user != null) {
        if (await bcrypt.compare(validData.password, user.passwordHash)) {
          const jwtoken = jwt.sign({ userId: user.userId }, config.JWT_SECRET);
          return res.status(200).json({ token: jwtoken });
        }
      }
      return res.status(401).json({
        error:
          "Authentication failed. Please check your email and/or password and try again.",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.message });
      } else {
        console.error(`[ERROR] LOGIN REQUEST`, { error: err });
        return res.status(500).send("An unexpected error has occurred.");
      }
    }
  }

  /**
   * Creates a new user account.
   * Validates input, hashes password, and creates user in database.
   */
  public static async signUp(req: Request, res: Response) {
    try {
      const validData = signUpSchema.parse(req.body);
      validData.password = await bcrypt.hash(validData.password, 10);
      const result = await UserRepository.createUser(validData);
      return res.status(200).json({
        message: "Sucessfully Signed up",
        user: {
          userId: result.userId,
          email: result.email,
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = (err as z.ZodError).issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        });
        return res.status(400).json({ errors: issues });
      } else if (err instanceof PrismaClientKnownRequestError) {
        switch ((err as PrismaClientKnownRequestError).code) {
          case "P2002":
            return res.status(409).json({
              error: {
                reason: "Unique constraint failed",
                message: `An account with this email already exists`,
              },
            });
          case "P2011":
            return res.status(409).json({
              error: {
                reason: "Null constraint failed",
                message: `User requires an email`,
              },
            });
        }
      } else {
        console.error(`[ERROR] CREATE USER REQUEST`, { error: err });
        return res.status(500).send("Unexpected error");
      }
    }
  }
}
