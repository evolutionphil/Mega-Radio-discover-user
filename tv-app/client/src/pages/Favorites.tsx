import { Link } from "wouter";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { AppLayout } from "@/components/AppLayout";

export const Favorites = (): JSX.Element => {
  useTVNavigation();

  const favoriteStations = [
    { name: "CNN International", location: "International", image: "/images/cnn-international-logo-1.png" },
    { name: "BBC Radio", location: "United Kingdom", image: "/images/-hdd91mb-400x400-1.png" },
    { name: "Power Türk", location: "Turkey", image: "/images/meta-image--1--1-4.png" },
    { name: "VOA", location: "USA, New York", image: "/images/c175-1.png" },
    { name: "VIBRA", location: "Italy, Rome", image: "/images/logo-1.png" },
    { name: "Metro FM", location: "Turkey, Istanbul", image: "/images/meta-image--1--1-4.png" },
  ];

  return (
    <AppLayout currentPage="favorites">
      <div className="relative w-[1920px] h-[1080px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e]" />

        {/* Main Content */}
        <div className="absolute left-[246px] top-[242px] right-[30px] bottom-[30px]">
        {/* Page Title */}
        <h1 className="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-12" data-testid="title-favorites">
          Your Favorites
        </h1>

        {favoriteStations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[600px]">
            <img
              className="w-[120px] h-[120px] mb-8 opacity-30"
              alt="Empty"
              src="/images/vuesax-bold-heart.svg"
            />
            <p className="font-['Ubuntu',Helvetica] font-medium text-[32px] text-[#9b9b9b] text-center">
              No favorite stations yet
            </p>
            <p className="font-['Ubuntu',Helvetica] font-medium text-[20px] text-[#666666] text-center mt-4">
              Press the heart icon on any station to add it to your favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {favoriteStations.map((station, index) => (
              <div
                key={index}
                className="bg-[rgba(255,255,255,0.05)] rounded-[20px] p-6 hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer group"
                data-testid={`card-favorite-${index}`}
                data-tv-focusable="true"
              >
                <div className="relative w-full aspect-square bg-white/10 rounded-[16px] mb-4 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt={station.name}
                    src={station.image}
                  />
                  <button className="absolute top-3 right-3 w-[40px] h-[40px] bg-[#ff4199] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-unfavorite-${index}`} data-tv-focusable="true">
                    <img
                      className="w-[20px] h-[20px]"
                      alt="Unfavorite"
                      src="/images/vuesax-bold-heart.svg"
                    />
                  </button>
                </div>
                <h3 className="font-['Ubuntu',Helvetica] font-bold text-[24px] text-white mb-1" data-testid={`text-favorite-name-${index}`}>
                  {station.name}
                </h3>
                <p className="font-['Ubuntu',Helvetica] font-medium text-[16px] text-[#9b9b9b]" data-testid={`text-favorite-location-${index}`}>
                  {station.location}
                </p>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </AppLayout>
  );
};
