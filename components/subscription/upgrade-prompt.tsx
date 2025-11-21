"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Crown, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createLemonSqueezyCheckout } from "@/app/actions/subscription";
import { toast } from "sonner";

interface UpgradePromptProps {
  title: string;
  description: string;
  feature: string;
  currentPlan: "FREE" | "PRO" | "ENTERPRISE";
  requiredPlan: "PRO" | "ENTERPRISE";
  onClose?: () => void;
  trigger?: "limit" | "feature";
  compact?: boolean;
}

export const UpgradePrompt = ({ 
  title, 
  description, 
  feature, 
  currentPlan, 
  requiredPlan, 
  onClose,
  trigger = "limit",
  compact = false 
}: UpgradePromptProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const result = await createLemonSqueezyCheckout(requiredPlan, "monthly");
      
      if (result.success && result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else {
        toast.error(result.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getIcon = () => {
    switch (requiredPlan) {
      case "PRO":
        return Crown;
      case "ENTERPRISE":
        return Sparkles;
      default:
        return Zap;
    }
  };

  const getPlanPrice = () => {
    switch (requiredPlan) {
      case "PRO":
        return "$19/month";
      case "ENTERPRISE":
        return "$49/month";
      default:
        return "";
    }
  };

  const Icon = getIcon();

  if (compact) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{title}</p>
                  <p className="text-xs text-muted-foreground truncate">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" onClick={handleUpgrade} disabled={isLoading}>
                  {isLoading ? "..." : "Upgrade"}
                </Button>
                {onClose && (
                  <Button variant="ghost" size="sm" onClick={handleClose}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader className="text-center pb-4">
                {onClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="absolute right-2 top-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-sm">
                  {description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">
                    {trigger === "limit" ? "You've reached your limit for:" : "This feature requires:"}
                  </h4>
                  <p className="text-sm text-muted-foreground">{feature}</p>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{requiredPlan} Plan</span>
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Starting at {getPlanPrice()}
                    </p>
                  </div>
                  <Button onClick={handleUpgrade} disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      "Upgrade Now"
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/pricing">View all plans</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};