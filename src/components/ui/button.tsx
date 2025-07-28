import { forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={clsx(
          'w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';