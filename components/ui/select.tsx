// components/ui/select.tsx
"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps extends Omit<HTMLMotionProps<"select">, "size"> {
  error?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <motion.select
          className={cn(
            "flex h-9 w-full appearance-none items-center justify-between rounded-lg border bg-transparent px-3 py-2 pr-8 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-input focus:ring-blue-500",
            className
          )}
          ref={ref}
          animate={error ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
          transition={
            error
              ? { type: "tween", duration: 0.4 }
              : { type: "spring", duration: 0.4 }
          }
          whileFocus={{ scale: 1.02 }}
          {...props}
        >
          {children}
        </motion.select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }