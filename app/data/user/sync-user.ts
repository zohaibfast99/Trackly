// src/app/data/user/sync-user.ts
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const syncUser = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return null;

  // Find the existing user in DB
  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  // If user doesn't exist, skip sync
  if (!existingUser) {
    console.log("syncUser: user not found in DB, skipping.");
    return user;
  }

  // If user.picture is a valid image and not gravatar, use it
  const imageUrl =
    user.picture && !user.picture.includes("gravatar.com")
      ? user.picture
      : null;

  // Only update if the image value differs
  if (existingUser.image !== imageUrl) {
    await db.user.update({
      where: { id: user.id },
      data: {
        image: imageUrl, // set to either Google image or null
      },
    });
    console.log("syncUser: updated image for", user.id);
  }

  return user;
};
