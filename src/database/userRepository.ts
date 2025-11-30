import database from "./database.js";
import { ISignUpRequest } from "../dtos/IAuthentication.js";

export class UserRepository {
  /**
   * Creates a new user account.
   *
   * @param input - User registration data
   * @returns The created user object
   * @throws Error if email already exists (unique constraint)
   */
  public static async createUser(input: ISignUpRequest) {
    return await database.user.create({
      data: {
        email: input.email,
        lastName: input.password, // BUG: Should be input.lastName
        firstName: input.firstName,
        passwordHash: input.password,
      },
    });
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param userId - The user ID to search for
   * @returns The user object, or null if not found
   */
  public static async findUserById(userId: number) {
    return await database.user.findFirst({ where: { userId } });
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param email - The email address to search for
   * @returns The user object, or null if not found
   */
  public static async findUserByEmail(email: string) {
    return await database.user.findFirst({ where: { email } });
  }
}
