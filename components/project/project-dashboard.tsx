import { CommentProps, ProjectProps } from "@/utils/types";
import { Activity, Task } from "@prisma/client";
import { ProjectHeader } from "./project-header";
import { Card } from "../ui/card";
import { TaskDistributionChart } from "./task-distribution-chart";
import { ActivityFeed } from "./activity-feed";
import { CommentList } from "./comment-list";
import { CircleProgress } from "./circle-progress";

interface ProjectDashboardProps{
    project:ProjectProps;
    tasks:{
        completed:number;
        inProgress:number;
        overdue:number;
        total:number;
        items: Task[];
};
activities:Activity[]
 totalWorkspaceMembers:number;
 comments:CommentProps[]

}

export const ProjectDashboard=({
    project,
    tasks,
    activities,
    totalWorkspaceMembers,
    comments,
}:ProjectDashboardProps)=>{
    console.log(tasks);
    return(<>
    <div className="flex flex-col gap-6 px-2 md:px-4 2xl:px-6 py-0">
        <ProjectHeader
        project={project as unknown as ProjectProps}
         />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
                <CircleProgress
            title="Task Completed"
            value={(tasks.completed/tasks.total)*100}
            subTitle={`${tasks.completed}/${tasks.total} tasks`} 
            variant="success"
            />
        </Card>
           <Card className="p-4">
              <CircleProgress
            title="In Progress"
            value={(tasks.inProgress/tasks.total)*100}
            subTitle={`${tasks.inProgress} tasks ongoing`} 
            variant="inProgress"
            />
           </Card>
             <Card className="p-4">
                <CircleProgress
            title="Overdue"
            value={(tasks.overdue/tasks.total)*100}
            subTitle={`${tasks.overdue} overdue tasks`} 
            variant="warning"
            />
             </Card>
           <Card className="p-4">
            <CircleProgress
            title="Team Members"
            value={(project.members.length)}
            subTitle={`${project.members.length} members`} 
            variant="default"
            />
           </Card>
         </div>
        
            
       
   
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TaskDistributionChart tasks={tasks}/>
         <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
           
            
            <ActivityFeed activities={activities.slice(0,5) as any} />
             </Card>
             <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Comments</h3>
            <CommentList comments={comments.slice(0,5) as any}/>
            </Card>
         
   
   
            </div>
             </div>
    </>
    );
};               