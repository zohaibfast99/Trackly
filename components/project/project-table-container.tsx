import { getProjectById } from "@/app/data/project/get-project-di";
import { ProjectTable } from "@/app/data/project/project-table";


export const ProjectTableContainer=async({projectId}:{projectId:string;})=>{
    const{tasks}=await getProjectById(projectId);
    return( <div className="p-0">
        <ProjectTable tasks={tasks as any}/>
    </div>
    );
}