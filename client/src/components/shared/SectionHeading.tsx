import type { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3';

interface SectionHeadingProps {
  level?: HeadingLevel;
  children: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  level = 'h2',
  children,
  subtitle,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const Tag = level;
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignClass} ${className}`}>
      <Tag>{children}</Tag>
      {subtitle && (
        <p
          className="body-lg mt-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
