interface CountryTriggerProps {
  selectedCountry: string;
  selectedCountryCode: string;
  onClick: () => void;
  focusClasses?: string;
  className?: string;
}

export const CountryTrigger = ({ 
  selectedCountry, 
  selectedCountryCode, 
  onClick,
  focusClasses = '',
  className = ''
}: CountryTriggerProps) => {
  const isGlobal = selectedCountryCode === 'GLOBAL';
  const globeSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Cdefs%3E%3ClinearGradient id="globeGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300bfff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230080ff;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="18" fill="url(%23globeGrad)" stroke="%23ffffff" stroke-width="2"/%3E%3Cellipse cx="20" cy="20" rx="8" ry="18" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cellipse cx="20" cy="20" rx="18" ry="8" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.8"/%3E%3Cpath d="M 20 2 Q 28 10 28 20 Q 28 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3Cpath d="M 20 2 Q 12 10 12 20 Q 12 30 20 38" fill="none" stroke="%23ffffff" stroke-width="1.5" opacity="0.6"/%3E%3C/svg%3E';
  
  return (
    <div 
      className={`flex w-[223px] h-[51px] rounded-[30px] bg-[#6b4f8a] pointer-events-auto cursor-pointer hover:bg-[#7d5fa0] transition-colors flex-shrink-0 ${focusClasses} ${className}`}
      style={{ padding: '11px 14.316px 11px 15px', justifyContent: 'center', alignItems: 'center' }}
      onClick={onClick}
      data-testid="button-country-selector"
    >
      <div className="flex items-center gap-[10.66px]">
        <div className="size-[28.421px] rounded-full overflow-hidden flex-shrink-0">
          <img 
            src={isGlobal ? globeSvg : `https://flagcdn.com/w40/${selectedCountryCode.toLowerCase()}.png`}
            alt={selectedCountry}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-['Ubuntu',Helvetica] font-bold leading-normal text-[24px] text-white whitespace-nowrap">
          {selectedCountry}
        </p>
        <div className="flex items-center justify-center ml-auto">
          <div className="rotate-[270deg]">
            <div className="relative size-[23.684px]">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
