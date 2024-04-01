import { sql, eq } from "drizzle-orm";
import { db } from "../db/db";
import { shells } from "../db/schema";
import { containerData } from "../../types/types";

export const getShellIds = async () => {
  const result = await db.select({ count: sql<number>`count(*)` }).from(shells);
  return result[0].count;
};

export const portAvailable = async (port: number) => {
  const check = await db.select().from(shells).where(eq(shells.port, port));
  if (check.length == 0) {
    return true;
  } else {
    return false;
  }
};

export const addShell = async (data: containerData) => {
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
};

export const getShells = async () => {
  const result = await db.select().from(shells);
  return result;
};

export const deleteShell = async (id: number) => {
  const result = await db.delete(shells).where(eq(shells.id, id));
  return result;
};

export const getShellFromId = async (id: number) => {
  const result = await db.select().from(shells).where(eq(shells.id, id));
  return result[0];
};

export const checkIfShellExists = async (name: string) => {
  const result = await db.select().from(shells).where(eq(shells.name, name));
  if (result.length > 0) {
    return true;
  }
  return false;
};

export const changeShellPassword = async (shell: containerData) => {
  const result = await db
    .update(shells)
    .set({ password: shell.password })
    .where(eq(shells.id, shell.id));
  return result;
};

export const changeShellRunningStatus = async (shell: containerData) => {
  const result = await db
    .update(shells)
    .set({ running: shell.running })
    .where(eq(shells.id, shell.id));
  return result;
};
