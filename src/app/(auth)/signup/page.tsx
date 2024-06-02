import { Flex, Heading } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { SignupForm } from "./components/signupForm";
import AuthService from "@/server/services/auth/auth.service";

export default async function LoginPage() {
  const authService = new AuthService();

  if (!(await authService.doSignUp())) redirect("/login");

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
        <SignupForm />
      </Flex>
    </Flex>
  );
}
