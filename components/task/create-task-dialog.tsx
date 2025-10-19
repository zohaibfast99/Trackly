"use client";


import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { taskFormSchema } from "@/lib/schema";
import { ProjectProps } from "@/utils/types"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

interface Props{
    
    project:ProjectProps;
}
type TaskFormValues=z.infer<typeof taskFormSchema>;
export const CreateTaskDialog=({project}:Props)=>{
    const router=useRouter();
    const[open,setOpen]=useState(false);
    const workspaceId = useWorkspaceId();
    const [pending,setPending]=useState(false);
    const form=useForm<TaskFormValues>({
        resolver:zodResolver(taskFormSchema),
        defaultValues:{
            title:"",
            description:"",
            status:"TODO",
            dueDate:new Date(),
            startDate: new Date(),
            priority:"MEDIUM",
            attachments:[],
        },
    });
    const handleOnSubmit=async(data:TaskFormValues)=>{};
    return<Dialog>
        <DialogTrigger asChild> <Button>Create Task</Button></DialogTrigger>
       
    </Dialog>;
}