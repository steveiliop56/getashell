import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { shells } from "../../db/schema";
import { ContainerData } from "../../../types/types";
import Database from "better-sqlite3";

export default class ShellService {
  public isPortAvailable = async (port: number): Promise<boolean> => {
    return (
      (await db.select().from(shells).where(eq(shells.port, port))).length === 0
    );
  };

  public addShell = async (
    data: ContainerData
  ): Promise<Database.RunResult> => {
    return await db.insert(shells).values({
      distro: data.distro,
      name: data.name,
      port: data.port,
      password: data.password,
      extraArgs: data.extraArgs,
      running: data.running,
    });
  };

  public getShells = async (): Promise<ContainerData[]> => {
    return await db.select().from(shells);
  };

  public deleteShell = async (id: number): Promise<Database.RunResult> => {
    return await db.delete(shells).where(eq(shells.id, id));
  };

  public getShellFromId = async (id: number): Promise<ContainerData> => {
    return (await db.select().from(shells).where(eq(shells.id, id))).at(0)!;
  };

  public checkIfShellExists = async (name: string): Promise<boolean> => {
    return !(
      (await db.select().from(shells).where(eq(shells.name, name))).length === 0
    );
  };

  public changeShellPassword = async (
    shell: ContainerData
  ): Promise<Database.RunResult> => {
    return await db
      .update(shells)
      .set({ password: shell.password })
      .where(eq(shells.id, shell.id));
  };

  public changeShellRunningStatus = async (
    shell: ContainerData
  ): Promise<Database.RunResult> => {
    return await db
      .update(shells)
      .set({ running: shell.running })
      .where(eq(shells.id, shell.id));
  };
}
