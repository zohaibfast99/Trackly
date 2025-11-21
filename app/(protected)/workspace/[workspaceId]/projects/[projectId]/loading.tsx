"use client";

import { motion } from "framer-motion";

export default function ProjectDashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header Tabs */}
      <div className="flex items-center gap-4">
        {["Dashboard", "Table", "Kanban"].map((_, i) => (
          <div
            key={i}
            className="h-7 w-20 bg-muted rounded-md"
          />
        ))}
      </div>

      {/* Project Header */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-md" />
          <div>
            <div className="h-5 w-32 bg-muted rounded-md mb-2" />
            <div className="h-4 w-48 bg-muted/70 rounded-md" />
          </div>
        </div>
        <div className="h-8 w-24 bg-muted rounded-md" />
      </div>

      {/* Team Member Bar */}
      <div className="h-12 w-full bg-muted rounded-xl" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-64 bg-muted rounded-xl" /> {/* Task Distribution */}
        <div className="h-64 bg-muted rounded-xl" /> {/* Recent Activities */}
        <div className="h-64 bg-muted rounded-xl" /> {/* Recent Comments */}
      </div>
    </div>
  );
}
