"use server"

import { TaskFormValues } from "@/components/task/create-task-dialog"
import { userRequired } from "../data/user/is-user-authenticated";
import { taskFormSchema } from "@/lib/schema";
import { db } from "@/lib/db";
import { success } from "zod";

export const createNewTask=async(data: TaskFormValues,
    projectId:string,
    workspaceId:string
)=>{
    const {user}=await userRequired();
    const validatedData=taskFormSchema.parse(data);
    const isUserMember=await db.workspaceMember.findUnique({
        where:{
            userId_workspaceId:{
                userId: user.id,
            workspaceId,
            },
        },
    });
    if(!isUserMember){
        throw new Error("Unauthorized to create task in this workspace.");
    }
    const tasks=await db.task.findMany({
        where:{projectId},
    });


    const lastTask=tasks?.filter(task=>task.status === data.status).sort((a,b)=>b.position=a.position)[0];

    const position= lastTask? lastTask.position +1000:1000;
    const task=await db.task.create({
        data:{
            title:validatedData.title,
            
            description:validatedData.description as string,
             startDate:new Date(validatedData.startDate),
            dueDate:new Date(validatedData.dueDate),
           
            projectId,
            assigneeId: validatedData.assigneeId,
            status:validatedData.status,
            priority:validatedData.priority,
            position
        },
        include:{
            project:true,
        },

    });
    await db.activity.create({
        data:{
            type:"TASK_Created",
            description:`created task "${validatedData.title}"`,
            projectId,
            userId:user.id,
        }
    })
    return {success:true};
};