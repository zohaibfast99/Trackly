// import { PricingPage } from "@/components/subscription/pricing-page";
// import { getUserSubscription } from "@/app/data/subscription/get-user-subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

export default async function PricingPageRoute() {
  // const subscriptionResult = await getUserSubscription();
  // const currentPlan = subscriptionResult.success && subscriptionResult.data 
  //   ? subscriptionResult.data.plan 
  //   : "FREE";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-muted-foreground">Choose the plan that works best for you</p>
        <Badge variant="secondary" className="mt-4">
          <Star className="h-3 w-3 mr-1" />
          Currently Free - Subscription features coming soon!
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="text-3xl font-bold">$0<span className="text-base font-normal">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Unlimited workspaces</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Unlimited projects</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Unlimited tasks</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Basic collaboration</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="relative border-primary">
          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For growing teams</CardDescription>
            <div className="text-3xl font-bold">$9<span className="text-base font-normal">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Everything in Free</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Advanced analytics</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Priority support</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Custom integrations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For large organizations</CardDescription>
            <div className="text-3xl font-bold">$29<span className="text-base font-normal">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Everything in Pro</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Advanced security</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />SSO integration</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />Dedicated support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}