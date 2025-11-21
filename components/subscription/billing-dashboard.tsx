"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Calendar, 
  Users, 
  FolderOpen, 
  Building2, 
  CheckCircle2,
  AlertCircle,
  Crown,
  Sparkles
} from "lucide-react";
import { PLAN_LIMITS, type PlanType } from "@/lib/subscription-limits";
import { cancelUserSubscription } from "@/app/actions/subscription";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface BillingDashboardProps {
  subscription: {
    id: string;
    plan: PlanType;
    status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
    currentPeriodEnd?: Date;
    frequency: string;
    cancelAtPeriodEnd: boolean;
    lemonsqueezyId?: string;
  } | null;
  usage: {
    workspaces: number;
    projects: number;
    members: number;
  };
}

export const BillingDashboard = ({ subscription, usage }: BillingDashboardProps) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const currentPlan = subscription?.plan || "FREE";
  const limits = PLAN_LIMITS[currentPlan];

  const handleCancelSubscription = async () => {
    if (!subscription?.lemonsqueezyId) return;

    try {
      setIsCancelling(true);
      const result = await cancelUserSubscription();
      
      if (result.success) {
        toast.success("Subscription cancelled successfully. You'll retain access until the end of your billing period.");
      } else {
        toast.error(result.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PAST_DUE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case "PRO":
        return Crown;
      case "ENTERPRISE":
        return Building2;
      default:
        return Sparkles;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const PlanIcon = getPlanIcon(currentPlan);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Billing & Usage</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and monitor usage
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/pricing">View Plans</a>
        </Button>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlanIcon className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">{currentPlan} Plan</CardTitle>
                  <CardDescription>
                    {subscription?.status === "ACTIVE" 
                      ? "Your subscription is active" 
                      : "Subscription status needs attention"
                    }
                  </CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(subscription?.status || "FREE")}>
                {subscription?.status || "FREE"}
              </Badge>
            </div>
          </CardHeader>
          
          {subscription && subscription.plan !== "FREE" && (
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Billing Cycle</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {subscription.frequency}
                    </p>
                  </div>
                </div>
                
                {subscription.currentPeriodEnd && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {subscription.cancelAtPeriodEnd ? "Expires" : "Renews"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Subscription Cancelled
                      </p>
                      <p className="text-xs text-yellow-700">
                        You'll retain access until {subscription.currentPeriodEnd && formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {subscription.status === "ACTIVE" && !subscription.cancelAtPeriodEnd && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                    className="text-destructive hover:text-destructive"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Usage Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>
              Monitor your current usage against plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workspaces Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Workspaces</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.workspaces} / {limits.workspaces === -1 ? "∞" : limits.workspaces}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(usage.workspaces, limits.workspaces)} 
                className="h-2"
              />
            </div>

            <Separator />

            {/* Projects Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.projects} / {limits.projectsPerWorkspace === -1 ? "∞" : `${limits.projectsPerWorkspace} per workspace`}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(usage.projects, limits.projectsPerWorkspace)} 
                className="h-2"
              />
            </div>

            <Separator />

            {/* Team Members Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Team Members</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usage.members} / {limits.membersPerWorkspace === -1 ? "∞" : `${limits.membersPerWorkspace} per workspace`}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(usage.members, limits.membersPerWorkspace)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>
              Features included in your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${
                  limits.features.analytics ? "text-green-600" : "text-gray-400"
                }`} />
                <span className={`text-sm ${
                  limits.features.analytics ? "" : "text-muted-foreground line-through"
                }`}>
                  Advanced Analytics
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${
                  limits.features.customBranding ? "text-green-600" : "text-gray-400"
                }`} />
                <span className={`text-sm ${
                  limits.features.customBranding ? "" : "text-muted-foreground line-through"
                }`}>
                  Custom Branding
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${
                  limits.features.advancedReporting ? "text-green-600" : "text-gray-400"
                }`} />
                <span className={`text-sm ${
                  limits.features.advancedReporting ? "" : "text-muted-foreground line-through"
                }`}>
                  Advanced Reporting
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${
                  limits.features.apiAccess ? "text-green-600" : "text-gray-400"
                }`} />
                <span className={`text-sm ${
                  limits.features.apiAccess ? "" : "text-muted-foreground line-through"
                }`}>
                  API Access
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${
                  limits.features.prioritySupport ? "text-green-600" : "text-gray-400"
                }`} />
                <span className={`text-sm ${
                  limits.features.prioritySupport ? "" : "text-muted-foreground line-through"
                }`}>
                  Priority Support
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade CTA for Free Users */}
      {currentPlan === "FREE" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Ready to grow?</h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to unlock advanced features and increase your limits
                  </p>
                </div>
                <Button asChild>
                  <a href="/pricing">Upgrade Now</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};