// import { BillingDashboard } from "@/components/subscription/billing-dashboard";
// import { getUserSubscription } from "@/app/data/subscription/get-user-subscription";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Users, Briefcase, Clock } from "lucide-react";

export default async function BillingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect("/api/auth/login");
  }

  // Get usage statistics
  const [workspacesCount, projectsCount, membersCount] = await Promise.all([
    db.workspaceMember.count({
      where: {
        userId: user.id,
        accessLevel: "OWNER",
      },
    }),
    db.project.count({
      where: {
        workspace: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    }),
    db.workspaceMember.count({
      where: {
        workspace: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Billing & Usage</h1>
        <p className="text-muted-foreground">Manage your account and view usage statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Workspaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspacesCount}</div>
            <p className="text-xs text-muted-foreground">Owned workspaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsCount}</div>
            <p className="text-xs text-muted-foreground">Total projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersCount}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">Free Plan</Badge>
              <p className="text-sm text-muted-foreground">
                Enjoying unlimited access to all features. Subscription tiers coming soon!
              </p>
            </div>
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}