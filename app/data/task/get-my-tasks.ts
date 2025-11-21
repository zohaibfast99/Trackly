import { db } from "@/lib/db";
import { userRequired } from "../user/is-user-authenticated";

export const getMyTasks = async () => {
  const { user } = await userRequired();

  const tasks = await db.task.findMany({
    where: {
      assigneeId: user.id,
    },
    include: {
      project: { select: { name: true, id: true, workspaceId: true } },
      attachments: { select: { name: true, id: true } },
    },
  });

  return tasks;
};
