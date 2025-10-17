import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React from "react"
interface ProjectPageProps{
    params: Promise<{workspaceId: string ; projectId:string}>;

    searchParams: Promise<{[key:string]:string | string[]|undefined}>;
    
}
const ProjectPage =async (props:ProjectPageProps) =>{
    const {workspaceId,projectId}=await props.params;
     const searchParams=await props.searchParams;

    return <div className="flex flex-col gap-6 pb-3 px-3">
        <Tabs defaultValue={(searchParams.view as string)|| "dashboard"} className="w-full">
            <TabsList className="mb-4">
                <link href="?view=dashboard">
                <TabsTrigger value="dashboard" className="px-1.5 md:px-3">Dashboard</TabsTrigger></link>
            </TabsList>
        </Tabs>
    </div>;
    
};
export default ProjectPage