import { useParams } from "next/navigation";

export const useProjectId = () => {
    const params = useParams<{ workspaceId: string; projectId: string; taskId?: string }>();

    return params.projectId;
};