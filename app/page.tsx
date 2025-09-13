import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button"
//import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-center">Welcome to Trackly</h1>
      <div className="flex gap-4 mt-6">
        <Button>
          <RegisterLink>
            Get Started
          </RegisterLink>
        </Button>
        <Button asChild variant={"outline"}>
          <LoginLink>
            Sign In
          </LoginLink>
        </Button>
      </div>
    </div>
  );
}
