import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "./sync-user";

export const userRequired = async () => {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect("/api/auth/login");

   
     const user = await syncUser();

    return { user, isUserAuthenticated };
  } catch (error) {
    console.error("Error in userRequired:", error);
    redirect("/api/auth/login");
  }
};
