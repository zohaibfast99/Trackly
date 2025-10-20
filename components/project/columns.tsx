import { Project } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  ArrowUpDown,
  EllipsisVertical,
  Paperclip,
  Clock,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { ProjectAvatar } from "./project-avatar";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { ProfileAvatar } from "../profile-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type TaskTableItem = {
  id: string;
  name: string;
  status: string;
  priority: string;
  createdAt: Date;
  dueDate: Date;
  assignedTo: {
    name: string;
    image?: string;
  };
  attachments: string[];
  project: Project;
};

export const columns: ColumnDef<TaskTableItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Task Title
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <Link
          href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}/${row.original.id}`}
          className="flex items-center gap-3 transition-all duration-200 hover:text-primary"
        >
          <ProjectAvatar name={title} />
          <span className="text-sm font-medium xl:text-base capitalize">
            {title}
          </span>
        </Link>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status as any}>
          {" "}
          {status === "IN_PROGRESS" ? "IN PROGRESS" : status}{" "}
        </Badge>
      );
    },
  },

  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge variant={"secondary"} className="font-normal">
          {" "}
          {priority}{" "}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          {format(new Date(createdAt), "MMM dd, yyyy")}
        </div>
      );
    },
  },

  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as Date;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
      );
    },
  },

  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as {
        name: string;
        image?: string;
      };
      return (
        <div className="flex items-center gap-2">
          <ProfileAvatar
            name={assignedTo?.name || "Unassigned"}
            url={assignedTo?.image}
          />
          <span className="text-sm">{assignedTo?.name || "Unassigned"}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "attachments",
    header: "Attachments",
    cell: ({ row }) => {
      const attachments = row.getValue("attachments") as string[];
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Paperclip className="w-4 h-4" />
          <span className="text-sm">{attachments.length}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-muted/60">
            <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem asChild>
            <Link
              href={`/workspace/${row.original.project.workspaceId}/projects/${row.original.project.id}/${row.original.id}`}
              className="cursor-pointer"
            >
              View Task
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 cursor-pointer hover:bg-red-600/10">
            Delete Task
            {/* <DeleteTask taskId={row.original.id}/> */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
