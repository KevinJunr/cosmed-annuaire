import { cn } from "@workspace/ui/lib/utils";

interface FormErrorProps {
  message: string | null;
  className?: string;
}

/**
 * Consistent error message display for forms
 */
export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md",
        className
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
