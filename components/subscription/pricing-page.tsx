"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Building2 } from "lucide-react";
import { PLAN_LIMITS } from "@/lib/subscription-limits";
import { createLemonSqueezyCheckout } from "@/app/actions/subscription";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PricingPageProps {
  currentPlan?: "FREE" | "PRO" | "ENTERPRISE";
}

const plans = [
  {
    name: "Free",
    plan: "FREE" as const,
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for getting started with personal projects",
    icon: Sparkles,
    popular: false,
    features: [
      `${PLAN_LIMITS.FREE.workspaces} workspace`,
      `${PLAN_LIMITS.FREE.projectsPerWorkspace} projects per workspace`,
      `${PLAN_LIMITS.FREE.membersPerWorkspace} team members`,
      `${PLAN_LIMITS.FREE.tasksPerProject} tasks per project`,
      `${PLAN_LIMITS.FREE.storageGB}GB storage`,
      "Basic reporting",
      "Email support",
    ],
  },
  {
    name: "Pro",
    plan: "PRO" as const,
    price: { monthly: 19, yearly: 190 },
    description: "Ideal for growing teams and businesses",
    icon: Crown,
    popular: true,
    features: [
      `${PLAN_LIMITS.PRO.workspaces} workspaces`,
      `${PLAN_LIMITS.PRO.projectsPerWorkspace} projects per workspace`,
      `${PLAN_LIMITS.PRO.membersPerWorkspace} team members`,
      `${PLAN_LIMITS.PRO.tasksPerProject} tasks per project`,
      `${PLAN_LIMITS.PRO.storageGB}GB storage`,
      "Advanced analytics",
      "Advanced reporting",
      "API access",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    plan: "ENTERPRISE" as const,
    price: { monthly: 49, yearly: 490 },
    description: "For large organizations with advanced needs",
    icon: Building2,
    popular: false,
    features: [
      "Unlimited workspaces",
      "Unlimited projects",
      "Unlimited team members",
      "Unlimited tasks",
      `${PLAN_LIMITS.ENTERPRISE.storageGB}GB storage`,
      "Advanced analytics",
      "Custom branding",
      "Advanced reporting",
      "API access",
      "Priority support",
      "Dedicated account manager",
    ],
  },
];

export const PricingPage = ({ currentPlan = "FREE" }: PricingPageProps) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (plan: "PRO" | "ENTERPRISE") => {
    try {
      setLoadingPlan(plan);
      const result = await createLemonSqueezyCheckout(plan, billingCycle);
      
      if (result.success && result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else {
        toast.error(result.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanStatus = (planType: string) => {
    if (planType === currentPlan) {
      return "current";
    }
    if (planType === "FREE") {
      return currentPlan !== "FREE" ? "downgrade" : "current";
    }
    return "upgrade";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Choose Your Plan
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground mb-8"
        >
          Scale your productivity with the right plan for your team
        </motion.p>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4"
        >
          <span className={billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}>
            Monthly
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative"
          >
            <div className={`w-12 h-6 rounded-full transition-colors ${
              billingCycle === "yearly" ? "bg-primary" : "bg-muted"
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-0.5"
              }`} />
            </div>
          </Button>
          <span className={billingCycle === "yearly" ? "font-semibold" : "text-muted-foreground"}>
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          )}
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const status = getPlanStatus(plan.plan);
          
          return (
            <motion.div
              key={plan.plan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className={`relative h-full ${
                plan.popular ? "ring-2 ring-primary shadow-lg" : ""
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-muted-foreground">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && plan.price.monthly > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${(plan.price.yearly / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={status === "current" ? "secondary" : plan.popular ? "default" : "outline"}
                    disabled={status === "current" || loadingPlan === plan.plan}
                    onClick={() => plan.plan !== "FREE" && handleUpgrade(plan.plan)}
                  >
                    {loadingPlan === plan.plan ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        {status === "current" && "Current Plan"}
                        {status === "upgrade" && `Upgrade to ${plan.name}`}
                        {status === "downgrade" && "Contact Support"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can start with our free plan and upgrade when you're ready. No credit card required.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 30-day money-back guarantee for all paid plans. No questions asked.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};