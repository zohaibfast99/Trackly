import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const userRequired = async () => {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect("/api/auth/login");

    const user = await getUser();
    if (!user?.id) {
      console.error("Kinde returned user:", user);
      throw new Error("Authenticated, but user object is missing an id");
    }

    return { user, isUserAuthenticated };
  } catch (error) {
    console.error("Error in userRequired:", error);
    redirect("/api/auth/login");
  }
};
