import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated";
import { TaskStatus } from "@prisma/client";
import { access } from "fs";

export const getProjectDetails=async(workspaceId:string, projectId:string)=>{
    try{
        const {user}=await userRequired()
        const[isUserMember,totalWorkspaceMembers]=await Promise.all([
            db.workspaceMember.findUnique({
                where:{
                    userId_workspaceId:{
                        userId:user.id,
                        workspaceId,
                    },

                },
            }),
            db.workspaceMember.count({
                where:{workspaceId},
            }),
        ]);
        if(!isUserMember){
            throw new Error("Unauthorized to view project details. ");
        }
        const [project,comments]= await Promise.all([
            db.project.findUnique({
                where:{
                    id:projectId,
                },
                select:{
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                    projectAccess:{
                        select:{
                            id: true,
                            hasAccess: true,
                            workspaceMember:{
                                select:{
                                    id: true,
                                    userId: true,
                                    accessLevel: true,
                                    user:{
                                        select:{name:true, id:true, email:true, image:true},
                                    },
                                },
                            },
                        },
                    },
                    tasks:{
                        select:{
                            id: true,
                            title: true,
                            description: true,
                            status: true,
                            priority: true,
                            startDate: true,
                            dueDate: true,
                            position: true,
                            createdAt: true,
                            updatedAt: true,
                            assignedTo:{
                                select:{name:true, id:true, image:true},
                            },
                            project:{
                                select:{name:true, id:true},
                            },
                        },
                        orderBy: { position: "asc" },
                    },
                    activities:{
                        select:{
                            id: true,
                            type: true,
                            description: true,
                            createdAt: true,
                            user:{
                                select:{name:true, id:true, image:true},
                            },
                        },
                        orderBy:{createdAt:"desc"},
                        take: 20,
                    },
                },
            }),
            db.comment.findMany({
                where:{projectId},
                select:{
                    id: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    user:{select:{name:true, id:true, image:true}},
                },
                orderBy:{createdAt:"desc"},
                take: 50,
            }),
        ]);



        const tasks={
            total: project?.tasks.length,
             completed: project?.tasks.filter((task)=> task.status === TaskStatus.COMPLETED).length,
             inProgress:project?.tasks.filter((task)=>task.status === TaskStatus.IN_PROGRESS).length,
             overdue:project?.tasks.filter((task)=> task.status !== TaskStatus.COMPLETED && task.dueDate &&  new Date(task.dueDate)< new Date()).length,
             items: project?.tasks,
        };
        return{
            project:{
                ...project,
                members:project?.projectAccess?.map((access)=> access.workspaceMember),
            },
            tasks,
            activities: project?.activities,
            totalWorkspaceMembers,
            comments,
        };
    }catch(error){
    console.log(error);
    return{
        success:false,
        error:true,
        message:"something went wrong",

    };
    }
};