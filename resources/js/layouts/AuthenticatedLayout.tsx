// resources/js/Layouts/AnalyseLayout.tsx
import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';

export interface AnalyseLayoutProps {
  children: ReactNode;
  title: string;
  user: {
    id: number;
    name: string;
    email: string;

};
header?: React.ReactNode; // Add this line
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
