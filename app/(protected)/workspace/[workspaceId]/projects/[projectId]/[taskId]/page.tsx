import { getTaskById } from '@/app/data/task/get-task-by-id';
import { userRequired } from '@/app/data/user/is-user-authenticated';
import { TaskComment } from '@/components/task/task-comment';
import { TaskDetails } from '@/components/task/task-details';
import { redirect } from 'next/navigation';
import React from 'react'

interface PageProps {
    params: Promise<{
        taskId: string;
        workspaceId: string;
        projectId: string;
    }>;
}

const TaskIdPage = async({params}: PageProps) => {
    await userRequired()

    const {taskId, workspaceId, projectId} = await params;

    const {task, comments} = await getTaskById(taskId, workspaceId, projectId);

    if (!task || !task.id) redirect("/not-found");
    
    return (
    <div className='flex flex-col lg:flex-row gap-6 md:px-6 pb-6'>
        <div className='flex-1'>
            <TaskDetails task={task as any}/>
        </div>

        <div className='w-full lg:w-[400px]'>
            <TaskComment taskId={task.id} comments={comments as any}/>
        </div>
    </div>
    );
};

export default TaskIdPage;
