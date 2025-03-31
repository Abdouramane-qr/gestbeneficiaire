// import { Head } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//     },
// ];

// interface DashboardProps {
//     totalPromoteurs: number;
//     totalEntreprises: number;
//     chiffreAffaires: number | string | null; // Accepte plusieurs types
// }

// export default function Dashboard({ totalPromoteurs, totalEntreprises, chiffreAffaires }: DashboardProps) {
//     // Convertir chiffreAffaires en nombre et formater
//     const formattedChiffreAffaires = typeof chiffreAffaires === 'number'
//         ? chiffreAffaires.toLocaleString()
//         : Number(chiffreAffaires || 0).toLocaleString();

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 {/* Grille de cartes pour les indicateurs clés */}
//                 <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//                     {/* Carte : Nombre total de promoteurs */}
//                     <Card className="border-sidebar-border/70 dark:border-sidebar-border">
//                         <CardHeader>
//                             <CardTitle className="text-lg font-semibold">Promoteurs</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold">{totalPromoteurs}</div>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">Nombre total de promoteurs</p>
//                         </CardContent>
//                     </Card>

//                     {/* Carte : Nombre total d'entreprises */}
//                     <Card className="border-sidebar-border/70 dark:border-sidebar-border">
//                         <CardHeader>
//                             <CardTitle className="text-lg font-semibold">Entreprises</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold">{totalEntreprises}</div>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">Nombre total d'entreprises</p>
//                         </CardContent>
//                     </Card>

//                     {/* Carte : Chiffre d'affaires */}
//                     <Card className="border-sidebar-border/70 dark:border-sidebar-border">
//                         <CardHeader>
//                             <CardTitle className="text-lg font-semibold">Chiffre d'affaires</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold">{formattedChiffreAffaires} €</div>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">Chiffre d'affaires total</p>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Section pour d'autres graphiques ou informations */}
//                 <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
//                     <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     <div className="relative z-10 p-4">
//                         <h2 className="text-xl font-semibold">Graphiques et statistiques</h2>
//                         <p className="text-gray-500 dark:text-gray-400">
//                             Cette section peut contenir des graphiques ou des tableaux supplémentaires.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight, BarChart3, LineChart } from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

interface DashboardProps {
  totalPromoteurs: number;
  totalEntreprises: number;
  chiffreAffaires: number | string | null;
}

export default function Dashboard({ totalPromoteurs, totalEntreprises, chiffreAffaires }: DashboardProps) {
  const [timeRange, setTimeRange] = useState('month');

  // Convertir chiffreAffaires en nombre et formater
  const formattedChiffreAffaires = typeof chiffreAffaires === 'number'
    ? chiffreAffaires.toLocaleString()
    : Number(chiffreAffaires || 0).toLocaleString();

  // Données simulées pour les tendances
  const promoteursTrend = +5.2;
  const entreprisesTrend = +3.8;
  const chiffreAffairesTrend = -2.1;

  // Données pour les graphiques
  const lineChartData = [
    { name: 'Jan', promoteurs: 65, entreprises: 40, ca: 2400 },
    { name: 'Fév', promoteurs: 78, entreprises: 52, ca: 1398 },
    { name: 'Mar', promoteurs: 87, entreprises: 61, ca: 9800 },
    { name: 'Avr', promoteurs: 99, entreprises: 74, ca: 3908 },
    { name: 'Mai', promoteurs: 111, entreprises: 83, ca: 4800 },
    { name: 'Jun', promoteurs: 125, entreprises: 95, ca: 3800 },
    { name: 'Jul', promoteurs: 142, entreprises: 110, ca: 4300 },
  ];

  const barChartData = [
    { name: 'Secteur A', value: 4000 },
    { name: 'Secteur B', value: 3000 },
    { name: 'Secteur C', value: 2000 },
    { name: 'Secteur D', value: 2780 },
    { name: 'Secteur E', value: 1890 },
  ];

  const pieChartData = [
    { name: 'Agriculture', value: 400 },
    { name: 'Artisanat', value: 300 },
    { name: 'Commerce', value: 300 },
    { name: 'Services', value: 200 },
    { name: 'Industrie', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Filtres en haut */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Tableau de bord JEM II OIM</h1>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grille de cartes pour les indicateurs clés */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Carte : Nombre total de promoteurs */}
          <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                Promoteurs
                <span className={`text-sm flex items-center ${promoteursTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {promoteursTrend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(promoteursTrend)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPromoteurs}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nombre total de promoteurs</p>
              <div className="h-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart width={300} height={40} data={lineChartData.slice(-5)}>
                    <Line type="monotone" dataKey="promoteurs" stroke="#8884d8" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Carte : Nombre total d'entreprises */}
          <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                Entreprises
                <span className={`text-sm flex items-center ${entreprisesTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {entreprisesTrend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(entreprisesTrend)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEntreprises}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nombre total d'entreprises</p>
              <div className="h-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart width={300} height={40} data={lineChartData.slice(-5)}>
                    <Line type="monotone" dataKey="entreprises" stroke="#82ca9d" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Carte : Chiffre d'affaires */}
          <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                Chiffre d'affaires
                <span className={`text-sm flex items-center ${chiffreAffairesTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {chiffreAffairesTrend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(chiffreAffairesTrend)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formattedChiffreAffaires} €</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chiffre d'affaires total</p>
              <div className="h-10 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart width={300} height={40} data={lineChartData.slice(-5)}>
                    <Line type="monotone" dataKey="ca" stroke="#ff8042" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section pour les graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Graphiques principaux avec onglets */}
          <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Évolution des indicateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="line">
                <TabsList className="mb-4">
                  <TabsTrigger value="line" className="flex items-center gap-1">
                    <LineChart size={16} />
                    Ligne
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="flex items-center gap-1">
                    <BarChart3 size={16} />
                    Barres
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="line">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart
                      data={lineChartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="promoteurs" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="entreprises" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="ca" stroke="#ff8042" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="bar">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={barChartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Répartition par secteur d'activité */}
          <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Répartition par secteur d'activité</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques supplémentaires */}
        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Statistiques régionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Région</th>
                    <th className="py-2 px-4 text-left">Promoteurs</th>
                    <th className="py-2 px-4 text-left">Entreprises</th>
                    <th className="py-2 px-4 text-left">Chiffre d'affaires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Nord</td>
                    <td className="py-2 px-4">42</td>
                    <td className="py-2 px-4">28</td>
                    <td className="py-2 px-4">152,000 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Sud</td>
                    <td className="py-2 px-4">38</td>
                    <td className="py-2 px-4">31</td>
                    <td className="py-2 px-4">185,200 €</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Est</td>
                    <td className="py-2 px-4">29</td>
                    <td className="py-2 px-4">24</td>
                    <td className="py-2 px-4">120,500 €</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Ouest</td>
                    <td className="py-2 px-4">33</td>
                    <td className="py-2 px-4">27</td>
                    <td className="py-2 px-4">142,300 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
