import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  className?: string;
}

const Alert = React.forwardRef(function Alert(
  props: AlertProps,
  // @ts-expect-error - Ref typing issue
  ref
) {
  const { className, variant, ...rest } = props;
  return (
    <div
      ref={ref}
      role="alert"
      className={alertVariants({ variant, className })}
      {...rest}
    />
  );
});
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(function AlertTitle(
  props: React.HTMLAttributes<HTMLHeadingElement>,
  // @ts-expect-error - Ref typing issue
  ref
) {
  return (
    <h5
      ref={ref}
      className="mb-1 font-medium leading-none tracking-tight"
      {...props}
    />
  );
});
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(function AlertDescription(
  props: React.HTMLAttributes<HTMLDivElement>,
  // @ts-expect-error - Ref typing issue
  ref
) {
  return (
    <div
      ref={ref}
      className="text-sm [&_p]:leading-relaxed"
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription } 