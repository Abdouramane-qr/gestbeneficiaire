// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import ModalCollecte from "@/components/CollecteFormModal";
// import { Table } from "lucide-react";

// const CollectesTable = ({ collectes }: { collectes: Collecte[] }) => {
//     const [modalOpen, setModalOpen] = useState(false);
//     const [selectedCollecte, setSelectedCollecte] = useState<Collecte | null>(null);

//     const openModal = (collecte?: Collecte) => {
//         setSelectedCollecte(collecte || null);
//         setModalOpen(true);
//     };

//     return (
//         <div>
//             <div className="flex justify-between mb-4">
//                 <h1 className="text-xl font-bold">Collectes Périodiques</h1>
//                 <Button onClick={() => openModal()}>+ Ajouter</Button>
//             </div>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableHeader>ID</TableHeader>
//                         <TableHeader>Nom</TableHeader>
//                         <TableHeader>Période</TableHeader>
//                         <TableHeader>Statut</TableHeader>
//                         <TableHeader>Actions</TableHeader>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {collectes.map((collecte) => (
//                         <TableRow key={collecte.id}>
//                             <TableCell>{collecte.id}</TableCell>
//                             <TableCell>{collecte.nom}</TableCell>
//                             <TableCell>{collecte.periode}</TableCell>
//                             <TableCell>{collecte.statut}</TableCell>
//                             <TableCell>
//                                 <Button size="sm" onClick={() => openModal(collecte)}>Modifier</Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//             {modalOpen && <ModalCollecte isOpen={modalOpen} onClose={() => setModalOpen(false)} collecte={selectedCollecte} />}
//         </div>
//     );
// };

// export default CollectesTable;
