import { sql, eq } from "drizzle-orm";
import { db } from "../db/db";
import { shells } from "../db/schema";
import { containerData } from "../types/types";

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
  const result = await db.select().from(shells);
  if (result.length == 0) {
    return false;
  }
  for (let i = 0; i <= result.length; i++) {
    if (result[i].name == name) {
      return true;
    }
  }
  return false;
};
