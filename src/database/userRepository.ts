import { ISignUpRequest } from "../dtos/IAuthentication";
import database from "./database";

export class UserRepository {
  public static async createUser(input: ISignUpRequest) {
    return await database.user.create({
      data: {
        email: input.email,
        lastName: input.password,
        firstName: input.firstName,
        passwordHash: input.password,
      },
    });
  }

  public static async findUserById(userId: number) {
    return await database.user.findFirst({ where: { userId: userId } });
  }

  public static async findUserByEmail(email: string) {
    return await database.user.findFirst({ where: { email: email } });
  }
}
