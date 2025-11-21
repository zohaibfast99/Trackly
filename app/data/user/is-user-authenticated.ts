import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "./sync-user";

export const userRequired = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  
  try {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
      redirect("/api/auth/login");
    }

    const user = await syncUser();

    if (!user || !user.id) {
      console.error("User is null after sync");
      redirect("/api/auth/login");
    }

    return { user: user!, isUserAuthenticated };
  } catch (error) {
    // Check if it's a Next.js redirect error - these should be re-thrown
    if (error && typeof error === 'object' && 'digest' in error) {
      const digest = (error as any).digest;
      if (typeof digest === 'string' && digest.includes('NEXT_REDIRECT')) {
        throw error; // Re-throw redirect errors
      }
    }
    
    console.error("Error in userRequired:", error);
    redirect("/api/auth/login");
  }
};
