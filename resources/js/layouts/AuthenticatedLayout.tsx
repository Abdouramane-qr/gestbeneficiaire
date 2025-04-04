// resources/js/Layouts/AnalyseLayout.tsx
import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';

interface AnalyseLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AnalyseLayout({ children, title }: AnalyseLayoutProps) {
  return (
    <>
      <Head title={title} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}
