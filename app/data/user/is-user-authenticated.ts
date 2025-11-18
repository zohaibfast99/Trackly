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
    // Check if it's a Next.js redirect error
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof (error as any).digest === 'string' && 
        (error as any).digest.startsWith('NEXT_REDIRECT')) {
      // Re-throw redirect errors - they're not actual errors
      throw error;
    }
    
    console.error("Error in userRequired:", error);
    redirect("/api/auth/login");
  }
};
