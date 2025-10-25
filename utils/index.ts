import { TaskStatus } from "@prisma/client";

export const roleList = [
    "Designer",
    "Developer",
    "Founder",
    "Project Manager",
    "Product Manager",
    "QA Analyst",
    "Team Member",
    "Tester",
    "UX Designer",
    "Other",
];

export const industryTypeList = [
    "Consumer Goods",
    "Education",
    "Finance",
    "Government",
    "Healthcare",
    "Manufacturing",
    "Marketing",
    "Retail",
    "Technology",
    "Other",
];
export const taskStats=[
{
    status:TaskStatus.TODO,
    label: "TO DO",
    color: "bg-blue-500",
},
{
    status:TaskStatus.IN_PROGRESS,
    label: "IN PROGRESS",
    color: "bg-yellow-500",
},
{
    status:TaskStatus.COMPLETED,
    label: "COMPLETED",
    color: "bg-green-500",
},
{
    status:TaskStatus.BLOCKED,
    label: "BLOCKED",
    color: "bg-red-500",
},
{
    status:TaskStatus.BACKLOG,
    label: "BACKLOG",
    color: "bg-gray-500",
},
{
    status:TaskStatus.IN_REVIEW,
    label: "IN REVIEW",
    color: "bg-blue-500",
},
];