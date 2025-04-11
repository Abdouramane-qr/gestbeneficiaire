// resources/js/Components/Analyse/Dropdown.tsx

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icone?: React.ElementType;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  icone: Icone
}: DropdownProps) {
  const [estOuvert, setEstOuvert] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {Icone && <Icone className="w-4 h-4 inline mr-1" />}
        {label}
      </label>
      <button
        type="button"
        onClick={() => setEstOuvert(!estOuvert)}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50"
      >
        <span>{value === 'all' ? `Tous${label === 'Région' || label === 'Province' || label === 'Commune' ? 'tes' : ''}` : value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {estOuvert && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            <button
              type="button"
              onClick={() => {
                onChange('all');
                setEstOuvert(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                value === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Tous{label === 'Région' || label === 'Province' || label === 'Commune' ? 'tes' : ''}
            </button>
            {options.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => {
                  onChange(option);
                  setEstOuvert(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  value === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
