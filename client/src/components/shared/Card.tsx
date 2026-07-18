import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { hoverable = false, padding = 'md', className = '', children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={[
          'bg-(--color-bg-elevated)',
          'border border-(--color-border)',
          'rounded-2xl',
          'shadow-sm',
          hoverable
            ? 'transition-shadow duration-200 ease-out hover:shadow-md'
            : '',
          paddingClasses[padding],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
