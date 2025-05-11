/

// namespace App\Exports;

// use Maatwebsite\Excel\Concerns\FromArray;
// use Maatwebsite\Excel\Concerns\WithHeadings;
// use Maatwebsite\Excel\Concerns\WithStyles;
// use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

// class IndicateursExport implements FromArray, WithHeadings, WithStyles
// {
//     protected $data;

//     public function __construct(array $data)
//     {
//         $this->data = $data;
//     }

//     public function array(): array
//     {
//         // Retirer l'en-tête (première ligne) puisqu'elle sera ajoutée via la méthode headings()
//         return array_slice($this->data, 1);
//     }

//     public function headings(): array
//     {
//         // Utiliser la première ligne comme en-têtes
//         return $this->data[0];
//     }

//     public function styles(Worksheet $sheet)
//     {
//         return [
//             // Style pour l'en-tête
//             1 => [
//                 'font' => ['bold' => true],
//                 'fill' => [
//                     'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
//                     'startColor' => ['rgb' => 'EEEEEE'],
//                 ],
//             ],
//         ];
//     }
// }
