import { db } from "@/lib/db";
import { userRequired } from "./is-user-authenticated";

export const getUserById = async () => {
  try {
    const { user } = await userRequired();
    const data = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    return {
        success: false,
        error:true,
        message :"Failed to get user",
        status : 500
    }
  }
};
