import { useLocation } from "wouter";
import { useCountry } from "@/contexts/CountryContext";
import { useFocusManager, getFocusClasses } from "@/hooks/useFocusManager";
import { Sidebar } from "@/components/Sidebar";
import { CountrySelector } from "@/components/CountrySelector";

export const CountrySelectPage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { selectedCountry, setCountry } = useCountry();

  const { isFocused } = useFocusManager({
    totalItems: 6,
    cols: 1,
    initialIndex: 5,
    onSelect: () => {},
    onBack: () => setLocation('/discover-no-user')
  });

  return (
    <div className="bg-[#0e0e0e] absolute inset-0 w-[1920px] h-[1080px] overflow-hidden" data-testid="page-country-select">
      <Sidebar
        activePage="country"
        isFocused={() => false}
        getFocusClasses={getFocusClasses}
      />
      <CountrySelector
        isOpen={true}
        mode="page"
        onClose={() => setLocation('/discover-no-user')}
        selectedCountry={selectedCountry}
        onSelectCountry={(country) => {
          setCountry(country.name, country.code, country.flag);
          setLocation('/discover-no-user');
        }}
      />
    </div>
  );
};
