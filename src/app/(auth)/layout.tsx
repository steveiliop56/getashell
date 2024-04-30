import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GetAShell - Login",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
