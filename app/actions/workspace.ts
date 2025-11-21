"use server"

import { cons } from './../../node_modules/effect/src/List';


import { CreateWorkspaceDataType } from "@/components/workspace/create-workspace-form"
import { userRequired } from "../data/user/is-user-authenticated"
import { workspaceSchema } from "@/lib/schema"
import { db } from "@/lib/db"
import { generateInviteCode } from "@/utils/get-invite-code"
import { sendInviteEmail } from "@/lib/mailer"
import { AccessLevel } from '@prisma/client';
import { redirect } from 'next/navigation';


export const createNewWorkspace = async (data: CreateWorkspaceDataType) => {
  try {
    const { user } = await userRequired()

    // Check plan limits before creating workspace - COMMENTED OUT
    // const { checkPlanLimits } = await import("./subscription");
    // const limitCheck = await checkPlanLimits("workspaces");

    // if (!limitCheck.canProceed) {
    //     return {
    //         status: 403,
    //         message: "You've reached your workspace limit for your current plan. Please upgrade to create more workspaces.",
    //         error: "PLAN_LIMIT_EXCEEDED",
    //         limit: limitCheck.limit,
    //         current: limitCheck.current
    //     };
    // }

    const validatedData = workspaceSchema.parse(data)

    const res = await db.workspace.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        ownerId: user.id,
        inviteCode: generateInviteCode(),
        members: {
          create: {
            userId: user.id,
            accessLevel: "OWNER"
          }
        }
      }
    })
    return { data: res };
  }
  catch (err) {
    console.log(err)
    return {
      status: 500,
      message: "An error occured while creating the workspace"
    }

  }
}

export const updateWorkspace = async (
  workspaceId: string,
  data: CreateWorkspaceDataType
) => {
  const { user } = await userRequired();

  const validatedData = workspaceSchema.parse(data);

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  await db.workspace.update({
    where: { id: workspaceId },
    data: {
      name: validatedData.name,
      description: validatedData.description || "",
    },
  });

  return { success: true };
};


export const resetWorkspaceInviteCode = async (workspaceId: string) => {
  const { user } = await userRequired();

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  await db.workspace.update({
    where: { id: workspaceId },
    data: {
      inviteCode: generateInviteCode(),
    },
  });
};


export const deleteWorkspace = async (workspaceId: string) => {
  const { user } = await userRequired();

  const isUserAMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspaceId,
      },
    },
  });

  if (!isUserAMember) {
    throw new Error("You are not a member of this workspace.");
  }

  if (isUserAMember && isUserAMember.accessLevel !== AccessLevel.OWNER) {
    throw new Error("only an owner can delete the workspace");
  }

  await db.workspace.delete({
    where: { id: workspaceId },

  });

  redirect("/workspace");
};

export const getWorkspaceStats = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();

    // Check if user is a member of the workspace
    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("You are not a member of this workspace.");
    }

    // Get task stats
    // Get all project IDs for this workspace
    const projectIds = await db.project.findMany({
      where: { workspaceId },
      select: { id: true },
    }).then(res => res.map(p => p.id));

    // Get task stats
    const taskStats = await db.task.groupBy({
      by: ["status"],
      where: {
        projectId: { in: projectIds },
      },
      _count: {
        id: true,
      },
    });


    // Get total tasks
    const totalTasks = await db.task.count({
      where: {
        project: {
          workspaceId: workspaceId,
        },
      },
    });

    // Get total members
    const totalMembers = await db.workspaceMember.count({
      where: { workspaceId },
    });

    // Get total projects
    const totalProjects = await db.project.count({
      where: { workspaceId },
    });

    // Get overdue tasks
    const tasksOverdue = await db.task.count({
      where: {
        project: {
          workspaceId: workspaceId,
        },
        dueDate: {
          lt: new Date(),
        },
        status: {
          notIn: ['COMPLETED'],
        },
      },
    });

    // Process task stats
    const statsMap = taskStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      totalTasks,
      completedTasks: statsMap['COMPLETED'] || 0,
      inProgressTasks: statsMap['IN_PROGRESS'] || 0,
      todoTasks: statsMap['TODO'] || 0,
      backlogTasks: statsMap['BACKLOG'] || 0,
      totalMembers,
      totalProjects,
      tasksOverdue,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching workspace stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch workspace stats',
    };
  }
};

export const getRecentTasks = async (workspaceId: string, limit: number = 5) => {
  try {
    const { user } = await userRequired();

    // Check if user is a member of the workspace
    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("You are not a member of this workspace.");
    }

    const recentTasks = await db.task.findMany({
      where: {
        project: {
          workspaceId: workspaceId,
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: recentTasks,
    };
  } catch (error) {
    console.error('Error fetching recent tasks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch recent tasks',
      data: [],
    };
  }
};

export const getWorkspaceInfo = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();

    // Check if user is a member of the workspace
    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("You are not a member of this workspace.");
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
      },
    });

    if (!workspace) {
      throw new Error("Workspace not found.");
    }

    return {
      success: true,
      data: workspace,
    };
  } catch (error) {
    console.error('Error fetching workspace info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch workspace info',
    };
  }
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  try {
    const { user } = await userRequired();

    // Check if user is a member of the workspace
    const isUserAMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!isUserAMember) {
      throw new Error("You are not a member of this workspace.");
    }

    const [members, workspace] = await Promise.all([
      db.workspaceMember.findMany({
        where: { workspaceId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      db.workspace.findUnique({
        where: { id: workspaceId },
        select: {
          id: true,
          name: true,
          inviteCode: true,
          ownerId: true,
        },
      }),
    ]);

    if (!workspace) {
      throw new Error("Workspace not found.");
    }

    return {
      success: true,
      data: { members, workspace },
    };
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch workspace members',
    };
  }
};

export const inviteUserToWorkspace = async (workspaceId: string, email: string) => {
  try {
    const { user } = await userRequired();

    // Check if current user is a member with appropriate permissions
    const currentUserMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!currentUserMember) {
      throw new Error("You are not a member of this workspace.");
    }

    // Only owners and members can invite (viewers cannot)
    if (currentUserMember.accessLevel === AccessLevel.VIEWER) {
      throw new Error("You don't have permission to invite users.");
    }

    // Check plan limits before inviting - COMMENTED OUT
    // const { checkPlanLimits } = await import("./subscription");
    // const limitCheck = await checkPlanLimits("membersPerWorkspace", workspaceId);

    // if (!limitCheck.canProceed) {
    //   return {
    //     success: false,
    //     error: "PLAN_LIMIT_EXCEEDED",
    //     message: "You've reached your team member limit for your current plan. Please upgrade to invite more members.",
    //     limit: limitCheck.limit,
    //     current: limitCheck.current
    //   };
    // }

    // Check if user with this email exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Check if user is already a member
      const existingMember = await db.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: existingUser.id,
            workspaceId: workspaceId,
          },
        },
      });

      if (existingMember) {
        throw new Error("User is already a member of this workspace.");
      }

      // Send invitation email without adding user to workspace yet
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
      const workspace = await db.workspace.findUnique({
        where: { id: workspaceId },
        select: { name: true, inviteCode: true }
      });

      if (!workspace) {
        return {
          success: false,
          error: "Workspace not found.",
        };
      }

      const inviteLink = `${baseUrl.replace(/\/$/, "")}/workspace-invite/${workspaceId}/join/${workspace.inviteCode}`;
      const inviterName = (user?.given_name ? `${user.given_name} ${user?.family_name || ''}`.trim() : undefined) || user?.email || 'Someone';

      // Send invitation email
      const sendResult = await sendInviteEmail(email, inviteLink, workspace.name, inviterName);

      if (!sendResult.success) {
        return {
          success: false,
          error: sendResult.error || "Failed to send invitation email.",
        };
      }

      return {
        success: true,
        message: "Invitation email sent successfully. User will be added to workspace when they accept the invitation.",
      };
    } else {
      // User doesn't exist - just return error message
      return {
        success: false,
        error: "User with this email address does not exist. Please ask them to sign up first.",
      };
    }
  } catch (error) {
    console.error('Error inviting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to invite user',
    };
  }
};

export const removeWorkspaceMember = async (workspaceId: string, memberId: string) => {
  try {
    const { user } = await userRequired();

    // Check if current user is the workspace owner
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { ownerId: true },
    });

    if (!workspace) {
      throw new Error("Workspace not found.");
    }

    if (workspace.ownerId !== user.id) {
      throw new Error("Only the workspace owner can remove members.");
    }

    // Get the member to remove
    const memberToRemove = await db.workspaceMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToRemove) {
      throw new Error("Member not found.");
    }

    if (memberToRemove.workspaceId !== workspaceId) {
      throw new Error("Member does not belong to this workspace.");
    }

    // Cannot remove the owner
    if (memberToRemove.accessLevel === AccessLevel.OWNER) {
      throw new Error("Cannot remove the workspace owner.");
    }

    // Remove the member
    await db.workspaceMember.delete({
      where: { id: memberId },
    });

    return {
      success: true,
      message: "Member removed successfully.",
    };
  } catch (error) {
    console.error('Error removing member:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove member',
    };
  }
};

export const updateMemberRole = async (workspaceId: string, memberId: string, newRole: AccessLevel) => {
  try {
    const { user } = await userRequired();

    // Check if current user is the workspace owner
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { ownerId: true },
    });

    if (!workspace) {
      throw new Error("Workspace not found.");
    }

    if (workspace.ownerId !== user.id) {
      throw new Error("Only the workspace owner can change member roles.");
    }

    // Get the member to update
    const memberToUpdate = await db.workspaceMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToUpdate) {
      throw new Error("Member not found.");
    }

    if (memberToUpdate.workspaceId !== workspaceId) {
      throw new Error("Member does not belong to this workspace.");
    }

    // Cannot change the owner's role
    if (memberToUpdate.accessLevel === AccessLevel.OWNER) {
      throw new Error("Cannot change the workspace owner's role.");
    }

    // Cannot make someone an owner (there can only be one owner)
    if (newRole === AccessLevel.OWNER) {
      throw new Error("Cannot assign owner role to another member.");
    }

    // Update the member's role
    await db.workspaceMember.update({
      where: { id: memberId },
      data: { accessLevel: newRole },
    });

    return {
      success: true,
      message: "Member role updated successfully.",
    };
  } catch (error) {
    console.error('Error updating member role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update member role',
    };
  }
};

export const getWorkspaceByInviteCode = async (workspaceId: string, inviteCode: string) => {
  try {
    const { user } = await userRequired();

    // Find workspace by ID and invite code
    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        inviteCode: inviteCode,
      },
      select: {
        id: true,
        name: true,
        description: true,
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!workspace) {
      return {
        success: false,
        error: "Invalid or expired invite link.",
      };
    }

    // Check if user is already a member
    const alreadyMember = workspace.members.some(member => member.userId === user.id);

    return {
      success: true,
      data: {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          description: workspace.description,
          memberCount: workspace.members.length,
        },
        alreadyMember,
      },
    };
  } catch (error) {
    console.error('Error fetching workspace by invite code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch workspace information',
    };
  }
};

export const joinWorkspaceWithInvite = async (workspaceId: string, inviteCode: string) => {
  try {
    const { user } = await userRequired();

    // Verify workspace and invite code
    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        inviteCode: inviteCode,
      },
    });

    if (!workspace) {
      return {
        success: false,
        error: "Invalid or expired invite link.",
      };
    }

    // Check if user is already a member
    const existingMember = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (existingMember) {
      return {
        success: false,
        error: "You are already a member of this workspace.",
      };
    }

    // Add user as a member
    await db.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspaceId,
        accessLevel: AccessLevel.MEMBER,
      },
    });

    return {
      success: true,
      message: "Successfully joined the workspace!",
    };
  } catch (error) {
    console.error('Error joining workspace:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to join workspace',
    };
  }
};

