"use server"

import { ProjectDataType } from "@/components/project/create-project-form"
import { userRequired } from "../data/user/is-user-authenticated"
import { db } from "@/lib/db"
import { projectSchema } from "@/lib/schema"

export const createNewProject = async (data: ProjectDataType) => {
    const {user} = await  userRequired()

    // Check plan limits before creating project - COMMENTED OUT
    // const { checkPlanLimits } = await import("./subscription");
    // const limitCheck = await checkPlanLimits("projectsPerWorkspace", data.workspaceId);
    
    // if (!limitCheck.canProceed) {
    //     return {
    //         status: 403,
    //         message: "You've reached your project limit for your current plan. Please upgrade to create more projects.",
    //         error: "PLAN_LIMIT_EXCEEDED",
    //         limit: limitCheck.limit,
    //         current: limitCheck.current
    //     };
    // }

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
};


export const postComments = async(workspaceId:string, 
    projectId:string,
    content: string
) => {
    const {user} = await userRequired();

    const isMember = await db.workspaceMember.findUnique({
        where:{
            userId_workspaceId:{
                userId:user.id,
                workspaceId,
            },
        },
    });

    if (!isMember){
        throw new Error("You are not a member of this workspace");
    }

    const projectAccess = await db.projectAccess.findUnique({
        where:{
            workspaceMemberId_projectId:{
                workspaceMemberId: isMember.id,
                projectId,
            },
        },
    });
    
    if (!projectAccess){
        throw new Error("You do not have access to this project");
    }

    const comment = await db.comment.create({
        data:{
            content,
            projectId,
            userId: user.id,
        },
    });

    return comment;
}