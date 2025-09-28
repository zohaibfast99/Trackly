import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const userRequired = async () => {
    const {isAuthenticated, getUser} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect ("/api/auth/login");
    const user = await getUser();
    if (!user?.id) {
        throw new Error("Authenticated, but user object is missing an id");
      }
    return{
        user,
        isUserAuthenticated,
    };
};