import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { shells } from "../db/schema";
import { ContainerData } from "../../types/types";
import Database from "better-sqlite3";

export default class QueriesService {
  public static async isPortAvailable(port: number): Promise<boolean> {
    const check = await db.select().from(shells).where(eq(shells.port, port));
    return check.length == 0;
  }

  public static async addShell(
    data: ContainerData,
  ): Promise<Database.RunResult> {
    const result = await db.insert(shells).values({
      distro: data.distro,
      name: data.name,
      port: data.port,
      password: data.password,
      extraArgs: data.extraArgs,
      running: data.running,
    });
    return result;
  }

  public static async getShells(): Promise<ContainerData[]> {
    return await db.select().from(shells);
  }

  public static async deleteShell(id: number): Promise<Database.RunResult> {
    return await db.delete(shells).where(eq(shells.id, id));
  }

  public static async getShellFromId(
    id: number,
  ): Promise<ContainerData | undefined> {
    return (await db.select().from(shells).where(eq(shells.id, id))).at(0);
  }

  public static async checkIfShellExists(name: string): Promise<boolean> {
    return (
      (await db.select().from(shells).where(eq(shells.name, name))).length > 0
    );
  }

  public static async changeShellPassword(
    shell: ContainerData,
  ): Promise<Database.RunResult> {
    return await db
      .update(shells)
      .set({ password: shell.password })
      .where(eq(shells.id, shell.id));
  }

  public static async changeShellRunningStatus(
    shell: ContainerData,
  ): Promise<Database.RunResult> {
    return await db
      .update(shells)
      .set({ running: shell.running })
      .where(eq(shells.id, shell.id));
  }
}
