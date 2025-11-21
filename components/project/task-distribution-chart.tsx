"use client";

import { Pie, PieChart, Label, Cell, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer } from "../ui/chart";

interface TaskDistributionProps {
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

export const TaskDistributionChart = ({ tasks }: TaskDistributionProps) => {
  const data = [
    { name: "Completed", value: tasks.completed, fill: "#22c55e" },
    { name: "In Progress", value: tasks.inProgress, fill: "#f59e0b" },
    { name: "Overdue", value: tasks.overdue, fill: "#ef4444" },
    {
      name: "Todo",
      value: tasks.total - (tasks.completed + tasks.inProgress + tasks.overdue),
      fill: "#3b82f6",
    },
  ].filter(item => item.value > 0);

  const chartConfig = {
  tasks: { label: "Tasks" },
  completed: { label: "Completed", color: "#22c55e" },
  inProgress: { label: "In Progress", color: "#f59e0b" },
  overdue: { label: "Overdue", color: "#ef4444" },
  todo: { label: "Todo", color: "#3b82f6" },
} satisfies ChartConfig;


  return (
    <Card className="flex flex-col rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center pb-2">
        <ChartContainer className="w-full max-w-[300px] aspect-square" config={chartConfig}>
          <PieChart>
            <RechartsTooltip 
              formatter={(value: number, name: string) => [`${value}`, name]} 
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="text-3xl font-bold fill-foreground"
                      >
                        {tasks.total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="text-sm text-muted-foreground"
                      >
                        Tasks
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <div className="flex gap-3 flex-wrap justify-center">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
        <p className="text-center">Total tasks for the project</p>
      </CardFooter>
    </Card>
  );
};
