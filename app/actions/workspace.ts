"use server"

import { cons } from './../../node_modules/effect/src/List';


import { CreateWorkspaceDataType } from "@/components/workspace/create-workspace-form"
import { userRequired } from "../data/user/is-user-authenticated"
import { workspaceSchema } from "@/lib/schema"
import { db } from "@/lib/db"
import { generateInviteCode } from "@/utils/get-invite-code"

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