import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Pagination from '@/components/Pagination';

interface AllReportsProps {
  rapports: {
    data: any[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  auth: any;
}

const AllReports: React.FC<AllReportsProps> = ({ rapports, auth }) => {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Tous les rapports" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <table className="w-full">
            {/* En-têtes et corps du tableau */}
            {rapports.data.map((rapport) => (
              // Lignes du tableau
            ))}
          </table>

          <Pagination links={rapports.links} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AllReports;
