import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-slate-700 leading-none", className)}
      {...props}
    />
  ),
)
Label.displayName = "Label"
