import React from 'react';

type SectionContainerProps = {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionContainer({
  id,
  title,
  children,
  className = '',
}: SectionContainerProps): React.ReactElement {
  return (
    <section id={id} className={`section ${className}`}>
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </section>
  );
}
