// Plan limits configuration
export const PLAN_LIMITS = {
  FREE: {
    workspaces: 1,
    projectsPerWorkspace: 3,
    membersPerWorkspace: 5,
    tasksPerProject: 50,
    storageGB: 1,
    features: {
      analytics: false,
      customBranding: false,
      advancedReporting: false,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  PRO: {
    workspaces: 5,
    projectsPerWorkspace: 25,
    membersPerWorkspace: 50,
    tasksPerProject: 500,
    storageGB: 10,
    features: {
      analytics: true,
      customBranding: false,
      advancedReporting: true,
      apiAccess: true,
      prioritySupport: false,
    },
  },
  ENTERPRISE: {
    workspaces: -1, // unlimited
    projectsPerWorkspace: -1, // unlimited
    membersPerWorkspace: -1, // unlimited
    tasksPerProject: -1, // unlimited
    storageGB: 100,
    features: {
      analytics: true,
      customBranding: true,
      advancedReporting: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export const isUnlimited = (limit: number) => limit === -1;

export const getPlanLimit = (plan: PlanType, limitType: keyof typeof PLAN_LIMITS.FREE) => {
  return PLAN_LIMITS[plan][limitType];
};

export const canExceedLimit = (current: number, limit: number) => {
  return isUnlimited(limit) || current < limit;
};

export const getPlanFeatures = (plan: PlanType) => {
  return PLAN_LIMITS[plan].features;
};