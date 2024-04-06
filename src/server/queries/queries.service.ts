import { sql, eq } from "drizzle-orm";
import { db } from "../db/db";
import { shells } from "../db/schema";
import { ContainerData } from "../../types/types";
import Database from "better-sqlite3";

export default class QueriesService {
  public static async getShellIdsAsync(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(shells);
    return result[0].count;
  }

  public static async isPortAvailableAsync(port: number): Promise<boolean> {
    const check = await db.select().from(shells).where(eq(shells.port, port));
    return check.length == 0;
  }

  public static async addShellAsync(
    data: ContainerData,
  ): Promise<Database.RunResult> {
    const result = await db.insert(shells).values({
      id: data.id,
      distro: data.distro,
      name: data.name,
      port: data.port,
      password: data.password,
      extraArgs: data.extraArgs,
      running: data.running,
    });
    return result;
  }

  public static async getShellsAsync(): Promise<ContainerData[]> {
    return await db.select().from(shells);
  }

  public static async deleteShellAsync(
    id: number,
  ): Promise<Database.RunResult> {
    return await db.delete(shells).where(eq(shells.id, id));
  }

  public static async getShellFromIdAsync(
    id: number,
  ): Promise<ContainerData | undefined> {
    return (await db.select().from(shells).where(eq(shells.id, id))).at(0);
  }

  public static async checkIfShellExistsAsync(name: string): Promise<boolean> {
    return (
      (await db.select().from(shells).where(eq(shells.name, name))).length > 0
    );
  }

  public static async changeShellPasswordAsync(
    shell: ContainerData,
  ): Promise<Database.RunResult> {
    return await db
      .update(shells)
      .set({ password: shell.password })
      .where(eq(shells.id, shell.id));
  }

  public static async changeShellRunningStatusAsync(
    shell: ContainerData,
  ): Promise<Database.RunResult> {
    return await db
      .update(shells)
      .set({ running: shell.running })
      .where(eq(shells.id, shell.id));
  }
}
