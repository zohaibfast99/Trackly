"use server";

import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PLAN_LIMITS, isUnlimited, type PlanType } from "@/lib/subscription-limits";
import { getUserSubscription } from "@/app/data/subscription/get-user-subscription";

export const createLemonSqueezyCheckout = async (planType: PlanType, frequency: "monthly" | "yearly") => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // LemonSqueezy product variant IDs (you'll need to set these from your LemonSqueezy dashboard)
    const PRODUCT_IDS = {
      PRO_MONTHLY: process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID,
      PRO_YEARLY: process.env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID,
      ENTERPRISE_MONTHLY: process.env.LEMONSQUEEZY_ENTERPRISE_MONTHLY_VARIANT_ID,
      ENTERPRISE_YEARLY: process.env.LEMONSQUEEZY_ENTERPRISE_YEARLY_VARIANT_ID,
    };

    let variantId;
    if (planType === "PRO") {
      variantId = frequency === "monthly" ? PRODUCT_IDS.PRO_MONTHLY : PRODUCT_IDS.PRO_YEARLY;
    } else if (planType === "ENTERPRISE") {
      variantId = frequency === "monthly" ? PRODUCT_IDS.ENTERPRISE_MONTHLY : PRODUCT_IDS.ENTERPRISE_YEARLY;
    }

    if (!variantId) {
      return { success: false, error: "Invalid plan selected" };
    }

    // Create checkout session with LemonSqueezy
    const checkoutData = {
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            enabled_variants: [variantId],
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
            receipt_button_text: "Go to Dashboard",
            receipt_thank_you_note: "Thank you for upgrading to Trackly!"
          },
          checkout_options: {
            embed: false,
            media: false,
            logo: true
          },
          checkout_data: {
            email: user.email,
            name: user.given_name + " " + user.family_name,
            custom: {
              user_id: user.id
            }
          },
          preview: true,
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID
            }
          },
          variant: {
            data: {
              type: "variants",
              id: variantId
            }
          }
        }
      }
    };

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const checkout = await response.json();
    const checkoutUrl = checkout.data.attributes.url;

    return { success: true, data: { checkoutUrl } };
  } catch (error) {
    console.error("Error creating checkout:", error);
    return { success: false, error: "Failed to create checkout session" };
  }
};

export const updateUserSubscription = async (subscriptionData: {
  lemonsqueezyId: string;
  orderId: string;
  customerId: string;
  plan: PlanType;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
  currentPeriodEnd?: Date;
  frequency?: string;
}) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    const updatedSubscription = await db.subscription.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        ...subscriptionData,
      },
      update: subscriptionData,
    });

    revalidatePath("/billing");
    return { success: true, data: updatedSubscription };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error: "Failed to update subscription" };
  }
};

export const cancelUserSubscription = async () => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    const subscriptionResult = await getUserSubscription();
    if (!subscriptionResult.success || !subscriptionResult.data) {
      return { success: false, error: "No active subscription found" };
    }

    const subscription = subscriptionResult.data;

    if (!subscription.lemonsqueezyId) {
      return { success: false, error: "Subscription not found in LemonSqueezy" };
    }

    // Cancel subscription in LemonSqueezy
    const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscription.lemonsqueezyId}`, {
      method: "PATCH",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "subscriptions",
          id: subscription.lemonsqueezyId,
          attributes: {
            cancelled: true,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel subscription in LemonSqueezy");
    }

    // Update local subscription
    const updatedSubscription = await db.subscription.update({
      where: {
        userId: user.id,
      },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    revalidatePath("/billing");
    return { success: true, data: updatedSubscription };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
};

export const checkPlanLimits = async (limitType: keyof typeof PLAN_LIMITS.FREE, workspaceId?: string) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return { success: false, error: "User not authenticated", canProceed: false };
    }

    const subscriptionResult = await getUserSubscription();
    if (!subscriptionResult.success) {
      return { success: false, error: "Failed to get subscription", canProceed: false };
    }

    const plan = subscriptionResult.data?.plan || "FREE";
    const limit = PLAN_LIMITS[plan as PlanType][limitType];

    if (isUnlimited(limit as number)) {
      return { success: true, canProceed: true, limit, current: 0 };
    }

    let current = 0;

    // Get current usage based on limit type
    switch (limitType) {
      case "workspaces":
        const workspaceCount = await db.workspaceMember.count({
          where: {
            userId: user.id,
            accessLevel: "OWNER",
          },
        });
        current = workspaceCount;
        break;

      case "projectsPerWorkspace":
        if (!workspaceId) {
          return { success: false, error: "Workspace ID required", canProceed: false };
        }
        const projectCount = await db.project.count({
          where: {
            workspaceId,
          },
        });
        current = projectCount;
        break;

      case "membersPerWorkspace":
        if (!workspaceId) {
          return { success: false, error: "Workspace ID required", canProceed: false };
        }
        const memberCount = await db.workspaceMember.count({
          where: {
            workspaceId,
          },
        });
        current = memberCount;
        break;
    }

    const canProceed = current < (limit as number);

    return {
      success: true,
      canProceed,
      limit,
      current,
      plan,
    };
  } catch (error) {
    console.error("Error checking plan limits:", error);
    return { success: false, error: "Failed to check limits", canProceed: false };
  }
};