"use client";

import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

interface RequiredLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean;
  optional?: boolean;
  optionalText?: string;
}

export function RequiredLabel({
  children,
  required = false,
  optional = false,
  optionalText = "optional",
  className,
  ...props
}: RequiredLabelProps) {
  return (
    <Label className={cn("flex items-center gap-1", className)} {...props}>
      {children}
      {required && <span className="text-destructive">*</span>}
      {optional && (
        <span className="text-muted-foreground font-normal">({optionalText})</span>
      )}
    </Label>
  );
}
