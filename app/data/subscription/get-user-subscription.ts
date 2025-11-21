import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getUserSubscription = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return { success: false, error: "User not found" };
    }

    let subscription = await db.subscription.findUnique({
      where: {
        userId: user.id,
      },
    });

    // Auto-create FREE subscription for new users
    if (!subscription) {
      subscription = await db.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "ACTIVE",
          frequency: "monthly",
          cancelAtPeriodEnd: false,
        },
      });
    }

    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return { success: false, error: "Failed to fetch subscription" };
  }
};

export const getOrCreateUserSubscription = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return { success: false, error: "User not found" };
    }

    let subscription = await db.subscription.findUnique({
      where: {
        userId: user.id,
      },
    });

    // Always create a FREE subscription if none exists - this is the default behavior
    if (!subscription) {
      subscription = await db.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "ACTIVE",
          frequency: "monthly",
          cancelAtPeriodEnd: false,
        },
      });
    }

    return { success: true, data: subscription };
  } catch (error) {
    console.error("Error getting/creating subscription:", error);
    return { success: false, error: "Failed to get subscription" };
  }
};

export const checkUserPlan = async () => {
  try {
    const result = await getOrCreateUserSubscription();
    if (!result.success || !result.data) {
      return "FREE";
    }

    const { plan, status } = result.data;
    
    // If subscription is not active, default to FREE
    if (status !== "ACTIVE") {
      return "FREE";
    }

    return plan;
  } catch (error) {
    console.error("Error checking user plan:", error);
    return "FREE";
  }
};