"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { type PlanType } from "@/lib/subscription-limits";
import { getUserSubscription } from "@/app/data/subscription/get-user-subscription";

interface SubscriptionContextType {
  subscription: {
    plan: PlanType;
    status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd: boolean;
  } | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  checkPlanAccess: (requiredPlan: PlanType) => boolean;
}

export const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionContextType["subscription"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const result = await getUserSubscription();
      if (result.success && result.data) {
        setSubscription({
          plan: result.data.plan as PlanType,
          status: result.data.status as any,
          currentPeriodEnd: result.data.currentPeriodEnd ? new Date(result.data.currentPeriodEnd) : undefined,
          cancelAtPeriodEnd: result.data.cancelAtPeriodEnd,
        });
      } else {
        // Always default to free plan for new users
        setSubscription({
          plan: "FREE",
          status: "ACTIVE",
          cancelAtPeriodEnd: false,
        });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Always fallback to FREE plan on error
      setSubscription({
        plan: "FREE",
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setIsLoading(true);
    await fetchSubscription();
  };

  const checkPlanAccess = (requiredPlan: PlanType) => {
    if (!subscription) return false;
    
    const planHierarchy = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
    const currentLevel = planHierarchy[subscription.plan];
    const requiredLevel = planHierarchy[requiredPlan];
    
    return currentLevel >= requiredLevel && subscription.status === "ACTIVE";
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      isLoading,
      refreshSubscription,
      checkPlanAccess,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}