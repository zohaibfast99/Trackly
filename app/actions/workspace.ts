"use server"

import { cons } from './../../node_modules/effect/src/List';


import { CreateWorkspaceDataType } from "@/components/workspace/create-workspace-form"
import { userRequired } from "../data/user/is-user-authenticated"
import { workspaceSchema } from "@/lib/schema"
import { db } from "@/lib/db"
import { generateInviteCode } from "@/utils/get-invite-code"
import { AccessLevel } from '@prisma/client';
import { redirect } from 'next/navigation'; 


export const createNewWorkspace = async(data : CreateWorkspaceDataType) => {
    try{
    const {user} = await userRequired()

    const validatedData = workspaceSchema.parse(data)

    const res = await db.workspace.create({
        data:{
            name: validatedData.name,
            description : validatedData.description,
            ownerId : user.id,
            inviteCode: generateInviteCode(),
            members : {
                create : {
                    userId : user.id,
                    accessLevel : "OWNER"
                }
            }
        }
    })
    return {data:res};
    }
    catch(err){
        console.log(err)
        return {
            status: 500,
            message : "An error occured while creating the workspace"
        }

    }
}

export const updateWorkspace = async (
  workspaceId: string,
  data:CreateWorkspaceDataType
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

  if (isUserAMember && isUserAMember.accessLevel !== AccessLevel.OWNER)
  {
    throw new Error("only an owner can delete the workspace");
  }

  await db.workspace.delete({
    where: { id: workspaceId },
   
  });

  redirect("/workspace");
};

