import { getConfig } from "@/config/config";
import { SessionData } from "@/types/types";
import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

const defaultSession: SessionData = {
  username: "",
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: getConfig().secretKey,
  cookieName: "session",
  cookieOptions: {
    secure: false, // TODO: Use https in the future
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.username = defaultSession.username;
  }

  return session;
}
