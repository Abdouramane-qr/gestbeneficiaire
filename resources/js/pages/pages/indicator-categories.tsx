// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// interface IndicatorCategoriesProps {
//   indicatorCategories: Record<string, string[]>;
// }

// export default function IndicatorCategories({ indicatorCategories }: IndicatorCategoriesProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold">Catégories d'Indicateurs</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {Object.entries(indicatorCategories).map(([period, categories]) => (
//             <div key={period}>
//               <h3 className="font-medium text-gray-700">{period}</h3>
//               <ul className="list-disc ml-6">
//                 {categories.map((category, index) => (
//                   <li key={index} className="text-sm text-gray-600">
//                     {category}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
