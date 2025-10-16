import { useState } from "react";

interface CountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: string, flag: string) => void;
  currentCountry?: string;
}

const countries = [
  { name: "Austria", flag: "/figmaAssets/at-1.png" },
  { name: "Germany", flag: "/figmaAssets/at-1.png" },
  { name: "United Kingdom", flag: "/figmaAssets/at-1.png" },
  { name: "United States", flag: "/figmaAssets/at-1.png" },
  { name: "Turkey", flag: "/figmaAssets/at-1.png" },
  { name: "Italy", flag: "/figmaAssets/at-1.png" },
  { name: "France", flag: "/figmaAssets/at-1.png" },
  { name: "Spain", flag: "/figmaAssets/at-1.png" },
];

export const CountrySelector = ({ isOpen, onClose, onSelect, currentCountry }: CountrySelectorProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="modal-country-selector">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        data-testid="backdrop-country-selector"
      />

      {/* Modal */}
      <div className="relative w-[600px] max-h-[700px] bg-[#1a1a1a] rounded-[20px] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 px-8 py-6 flex items-center justify-between">
          <h2 className="font-['Ubuntu',Helvetica] font-bold text-[32px] text-white" data-testid="title-select-country">
            Select Country
          </h2>
          <button
            onClick={onClose}
            className="w-[40px] h-[40px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            data-testid="button-close-country-selector"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Countries List */}
        <div className="p-6 max-h-[550px] overflow-y-auto">
          <div className="space-y-2">
            {countries.map((country, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(country.name, country.flag);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[12px] transition-colors ${
                  currentCountry === country.name
                    ? 'bg-[#ff4199]/20 border-2 border-[#ff4199]'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                data-testid={`button-country-${index}`}
              >
                <img
                  className="w-[32px] h-[32px] rounded-full"
                  alt={country.name}
                  src={country.flag}
                />
                <p className="font-['Ubuntu',Helvetica] font-medium text-[20px] text-white flex-1 text-left">
                  {country.name}
                </p>
                {currentCountry === country.name && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#ff4199" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
