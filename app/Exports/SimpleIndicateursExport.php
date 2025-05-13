<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class SimpleIndicateursExport implements FromCollection, WithHeadings, WithTitle, ShouldAutoSize
{
    protected $data;
    protected $headers;
    protected $title;

    public function __construct(array $data, array $headers, string $title = 'Données')
    {
        $this->data = $data;
        $this->headers = $headers;
        $this->title = $title;
    }

    public function collection()
    {
        return collect($this->data);
    }

    public function headings(): array
    {
        return $this->headers;
    }

    public function title(): string
    {
        return $this->title;
    }
}
