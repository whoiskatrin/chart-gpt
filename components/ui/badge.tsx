import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { clsx } from 'clsx';

const badgeVariants = cva(
  'flex items-center border rounded-md px-2.5 text-xs font-semibold transition-colors focus:outline-none h-6',
  {
    variants: {
      variant: {
        default:
          'bg-primary bg-zinc-500/10 dark:bg-zinc-300/20 border-transparent text-zinc-700 dark:text-zinc-100',
        secondary:
          'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
        destructive:
          'bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={clsx(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
