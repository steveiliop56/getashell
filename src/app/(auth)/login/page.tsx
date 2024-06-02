import { Flex, Heading } from "@radix-ui/themes";
import { LoginForm } from "./components/loginForm/loginForm";
import { redirect } from "next/navigation";
import QueriesService from "@/server/queries/queries.service";

export default async function LoginPage() {
  if (await QueriesService.doSignUp()) redirect("/signup");

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
