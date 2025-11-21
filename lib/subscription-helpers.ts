import { toast } from "sonner";

export interface PlanLimitError {
  error: "PLAN_LIMIT_EXCEEDED";
  message: string;
  limit: number | string;
  current: number;
}

export const handlePlanLimitError = (error: PlanLimitError, onUpgradeClick?: () => void) => {
  toast.error(error.message, {
    action: onUpgradeClick ? {
      label: "Upgrade",
      onClick: onUpgradeClick,
    } : {
      label: "View Plans",
      onClick: () => {
        window.location.href = "/pricing";
      },
    },
    duration: 8000,
  });
};

export const isLimitError = (result: any): result is { error: "PLAN_LIMIT_EXCEEDED" } & PlanLimitError => {
  return result && result.error === "PLAN_LIMIT_EXCEEDED";
};

export const createLimitErrorMessage = (feature: string, limit: number | string, current: number) => {
  const limitText = limit === -1 || limit === "∞" ? "unlimited" : limit.toString();
  return `You've reached your ${feature} limit (${current}/${limitText}) for your current plan.`;
};