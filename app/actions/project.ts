"use server"

import { ProjectDataType } from "@/components/project/create-project-form"
import { userRequired } from "../data/user/is-user-authenticated"
import { db } from "@/lib/db"
import { projectSchema } from "@/lib/schema"

export const createNewProject = async (data: ProjectDataType) => {
    const {user} = await  userRequired()

    const workspace = await db.workspace.findUnique({
        where:{id:data?.workspaceId},
        include:{
            projects:{select :{id:true}},
        }
    })

    const validateData = projectSchema.parse(data)

    const workspaceMemberMembers =await  db.workspaceMember.findMany({
        where: {
        
            workspaceId: data.workspaceId,

        }
    })

    const isUserMember = workspaceMemberMembers.some((member)=>member.userId=== user.id)
    if(!isUserMember){
        throw new Error("Unauthorized to create project in this workspace.")
    }
    if(validateData.memberAccess?.length === 0){
        validateData.memberAccess = [user.id];

    }
    else if(!validateData.memberAccess?.includes(user.id)){
        validateData?.memberAccess?.push(user.id)
    }

    await db.project.create({
        data:{
            name:validateData.name,
            description:validateData.description || "",
            workspaceId:validateData.workspaceId,
            projectAccess : {
                create : validateData.memberAccess?.map((memberId)=>({
                    workspaceMemberId : workspaceMemberMembers.find((member)=> member?.userId === memberId
                )?.id!,
                hasAccess:true,

                }))
            },
            activities:{
                create:{
                    type:"PROJECT_CREATED",
                    description:`created project ${validateData.name}`,
                    userId:user.id,
                }
            }
        }
    })

    return {success:true}
}