import { useState } from 'react';
import turkeyFlag from '@assets/stock_images/turkey_flag_icon_90da75bd.jpg';
import germanyFlag from '@assets/stock_images/germany_flag_icon_59644cc1.jpg';
import usaFlag from '@assets/stock_images/usa_flag_icon_c457cbee.jpg';
import franceFlag from '@assets/stock_images/france_flag_icon_18b48b55.jpg';
import spainFlag from '@assets/stock_images/spain_flag_icon_961ef74e.jpg';
import italyFlag from '@assets/stock_images/italy_flag_icon_faebeb02.jpg';
import austriaFlag from '@assets/stock_images/austria_flag_icon_9c009934.jpg';

interface Country {
  name: string;
  code: string;
  flag: string;
}

const countries: Country[] = [
  { name: 'Turkey', code: 'TR', flag: turkeyFlag },
  { name: 'Germany', code: 'DE', flag: germanyFlag },
  { name: 'USA', code: 'US', flag: usaFlag },
  { name: 'France', code: 'FR', flag: franceFlag },
  { name: 'Spain', code: 'ES', flag: spainFlag },
  { name: 'Italy', code: 'IT', flag: italyFlag },
  { name: 'Austria', code: 'AT', flag: austriaFlag },
];

interface CountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: string;
  onSelectCountry: (country: Country) => void;
}

export const CountrySelector = ({ isOpen, onClose, selectedCountry, onSelectCountry }: CountrySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountryClick = (country: Country) => {
    onSelectCountry(country);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur (transparent) */}
      <div 
        className="absolute inset-0 backdrop-blur-[7px] backdrop-filter"
        onClick={onClose}
        data-testid="country-selector-backdrop"
      />

      {/* Modal Container */}
      <div className="relative">
        {/* Back Button */}
        <div 
          className="absolute left-0 top-[-43px] h-[24px] w-[71px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onClose}
          data-testid="button-back"
        >
          <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[28px] not-italic text-[#c8c8c8] text-[19.027px] top-px">
            Back
          </p>
          <div className="absolute left-0 size-[24px] top-0">
            <img
              alt="back"
              className="block max-w-none size-full"
              src="/figmaAssets/vuesax-outline-arrow-left.svg"
            />
          </div>
        </div>

        {/* Modal */}
        <div className="relative bg-black h-[534px] w-[1006px] overflow-clip rounded-[14px]">
          {/* Search Bar */}
          <div className="absolute backdrop-blur-[13.621px] backdrop-filter bg-[rgba(255,255,255,0.2)] border-[#717171] border-[2.594px] border-solid h-[75px] left-[19px] rounded-[12px] top-[21px] w-[968px]">
            <div className="h-[75px] overflow-clip relative rounded-[inherit] w-[968px]">
              <div className="absolute h-[31.134px] left-[45px] top-1/2 -translate-y-1/2 flex items-center gap-[15px]">
                <div className="size-[31.134px]">
                  <img
                    alt="search"
                    className="block max-w-none size-full"
                    src="/figmaAssets/vuesax-bold-search-normal.svg"
                  />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Country"
                  className="font-['Ubuntu',Helvetica] font-medium leading-normal not-italic text-[25.945px] text-white bg-transparent border-none outline-none placeholder:text-white/60 w-[800px]"
                  data-testid="input-country-search"
                />
              </div>
            </div>
          </div>

          {/* Countries List - Scrollable */}
          <div className="absolute left-[20px] top-[119px] w-[967px] h-[395px] overflow-y-auto">
            {filteredCountries.map((country, index) => {
              const isSelected = country.name === selectedCountry;
              return (
                <div
                  key={country.code}
                  className={`bg-[#2b2b2b] ${isSelected ? 'border-[#d2d2d2] border-[5px]' : ''} border-solid h-[70px] rounded-[10px] w-[967px] cursor-pointer hover:bg-[#3b3b3b] transition-colors`}
                  style={{ marginTop: index === 0 ? 0 : '15px' }}
                  onClick={() => handleCountryClick(country)}
                  data-testid={`country-option-${country.code}`}
                >
                  <div className="h-[70px] overflow-clip relative rounded-[inherit] w-[967px]">
                    <p className="absolute font-['Ubuntu',Helvetica] font-medium leading-normal left-[70px] not-italic text-[15px] text-white top-[26px]">
                      {country.name}
                    </p>
                    <div className="absolute bg-[#979797] left-[15px] overflow-clip rounded-[20px] size-[40px] top-[15px]">
                      <img
                        alt={country.name}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                        src={country.flag}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
