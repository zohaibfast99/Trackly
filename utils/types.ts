import { AccessLevel, Workspace } from "@prisma/client";
import { $Enums } from "@prisma/client";


export interface WorkspaceMembersProps extends Workspace {
    user :{
        id:string;
        name:string;
        email:string;
        image?:string
    };
    projectAccess :{
        id:string;
        hasAccess:boolean;
        projectId:string;
    }[];
}

export interface ProjectProps{
    id: string;
    name:string;
    description?:string|null;
    workspaceId:string;
    members : {
        id:string;
        userId : string;
        workspaceId:string;
        accessLevel : AccessLevel;
        createdAt : Date;
        user :{
            id:string;
            name:string;
            email:string;
            image:string;
        }
    }[];

}

export interface WorkspacesProps {
    id:string;
    createdAt: Date;
    userId:string;
    workspaceId : string;
    AccessLevel : $Enums.AccessLevel;
    workspace:{
        name:string;
    }
}