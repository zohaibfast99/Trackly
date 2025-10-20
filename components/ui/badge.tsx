import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        OWNER:"bg-pink-600 text-white",
        MEMBER:"bg-blue-600 text-white",
        VIWER:"bg-gray-600 text-white",
        TODO:"bg-blue-600 text-white",
        IN_PROGRESS:"bg-yellow-600 text-white",
        BACKLOG:"bg-pink-600 text-white",
        IN_REVIEW:"bg-purple-600 text-white",
        COMPLETED:"bg-green-600 text-white",
        BLOCKED:"bg-red-600 text-white",
        CRITICAL:"bg-red-600 text-white",
        HIGH:"bg-orange-600 text-white",
        MEDIUM:"bg-yellow-600 text-white",
        LOW:"bg-blue-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
