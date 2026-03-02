import { cloneElement, forwardRef, isValidElement } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-accent-500 text-slate-950 hover:bg-accent-400',
  ghost: 'border border-border bg-transparent text-slate-200 hover:bg-surface-hover',
  secondary: 'bg-primary-700 text-white hover:bg-primary-600',
  danger: 'bg-red-600 text-white hover:bg-red-500'
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
};

export const Button = forwardRef(function Button(
  { className, variant = 'default', size = 'md', asChild = false, children, ...props },
  ref
) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-md font-medium transition active:scale-[0.98] disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(classes, children.props.className),
      ...props
    });
  }

  const Comp = 'button';
  return (
    <Comp
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </Comp>
  );
});

export default Button;
