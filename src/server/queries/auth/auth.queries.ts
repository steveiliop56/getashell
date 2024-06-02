import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { users } from "../../db/schema";
import Database from "better-sqlite3";
import { userData } from "../../../types/types";

export default class AuthQueries {
  public doSignUp = async (): Promise<boolean> => {
    return (await db.select().from(users)).length === 0;
  };

  public addUser = async (
    username: string,
    password: string
  ): Promise<Database.RunResult> => {
    const result = await db.insert(users).values({
      username: username,
      password: password,
    });
    return result;
  };

  public checkIfUserExists = async (username: string): Promise<boolean> => {
    return (
      (await db.select().from(users).where(eq(users.username, username)))
        .length > 0
    );
  };

  public getUser = async (username: string): Promise<userData> => {
    return (
      await db.select().from(users).where(eq(users.username, username))
    ).at(0)!;
  };
}
