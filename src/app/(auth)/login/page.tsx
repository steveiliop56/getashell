import { Flex, Heading } from "@radix-ui/themes";
import { LoginForm } from "./components/loginForm/loginForm";
import { redirect } from "next/navigation";
import AuthQueries from "@/server/queries/auth/auth.queries";
import { getSession } from "@/lib/helpers/session.helper";

export default async function LoginPage() {
  const authQueries = new AuthQueries();
  const session = await getSession();

  if (session.isLoggedIn) redirect("/");

  if (await authQueries.doSignUp()) redirect("/signup");

  return (
    <Flex className="flex-col gap-10 p-10 text-center h-screen">
      <Flex className="m-auto flex-col gap-10 p-5">
        <Heading
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text"
          size="9"
          as="h1"
        >
          Get A Shell
        </Heading>
        <LoginForm />
      </Flex>
    </Flex>
  );
}
