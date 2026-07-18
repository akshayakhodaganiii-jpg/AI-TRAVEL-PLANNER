import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-(--color-primary) text-white',
    'hover:bg-(--color-primary-dark)',
    'active:bg-(--color-primary-dark)',
    'focus-visible:ring-2 focus-visible:ring-(--color-primary-light) focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-(--color-primary)',
  ].join(' '),

  secondary: [
    'bg-(--color-secondary) text-white',
    'hover:bg-(--color-secondary-dark)',
    'active:bg-(--color-secondary-dark)',
    'focus-visible:ring-2 focus-visible:ring-(--color-secondary-light) focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-(--color-secondary)',
  ].join(' '),

  ghost: [
    'bg-transparent text-(--color-text-primary)',
    'hover:bg-(--color-bg-soft)',
    'active:bg-(--color-bg-soft)',
    'focus-visible:ring-2 focus-visible:ring-(--color-border) focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center gap-2',
          'rounded-xl font-medium min-h-[44px]',
          'transition-all duration-200 ease-out',
          'cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
