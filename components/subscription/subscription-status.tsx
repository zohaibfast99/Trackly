"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Loader2, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export const SubscriptionStatus = () => {
  const { subscription, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border-t">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const planColors = {
    FREE: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200",
    PRO: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    ENTERPRISE: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
  };

  const currentPlan = subscription?.plan || 'FREE';

  return (
    <motion.div 
      className="px-3 py-3 border-t bg-card/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {currentPlan === 'FREE' ? (
            <Crown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Zap className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium">Current Plan</span>
        </div>
        <Badge 
          variant="secondary" 
          className={`${planColors[currentPlan]} font-medium text-xs`}
        >
          {currentPlan}
        </Badge>
      </div>
      
      {currentPlan === 'FREE' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <p className="text-xs text-muted-foreground">
            Upgrade to unlock unlimited projects and advanced features
          </p>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              className="flex-1 h-8 text-xs bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
              asChild
            >
              <Link href="/pricing" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Upgrade
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-8 text-xs px-2"
              asChild
            >
              <Link href="/billing">
                Billing
              </Link>
            </Button>
          </div>
        </motion.div>
      )}

      {currentPlan !== 'FREE' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <p className="text-xs text-muted-foreground">
            You have access to all {currentPlan.toLowerCase()} features
          </p>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full h-8 text-xs"
            asChild
          >
            <Link href="/billing">
              Manage Subscription
            </Link>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};