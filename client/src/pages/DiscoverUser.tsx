import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const recentlyPlayedStations = [
  {
    name: "BBC Radio",
    location: "United Kingdom",
    image: "/figmaAssets/-hdd91mb-400x400-1.png",
  },
  {
    name: "WEEU",
    location: "USA",
    image: "/figmaAssets/830-weeu-1-1.png",
  },
  {
    name: "CNN",
    location: "Internatinal",
    image: "/figmaAssets/cnn-international-logo-1.png",
    featured: true,
  },
  {
    name: "NBC News",
    location: "USA",
    image: "/figmaAssets/2616697-nbc-news-logo-stacked--1--1.png",
  },
  {
    name: "Power Türk",
    location: "Turkey",
    image: "/figmaAssets/meta-image--1--1-4.png",
  },
  {
    name: "Cheddar",
    location: "USA",
    image: "/figmaAssets/cheddar-news-1.png",
  },
  {
    name: "WNYC",
    location: "USA, New York",
    image: "/figmaAssets/c175--1--1.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/0b75jzrr-400x400-1-8.png",
  },
];

const genres = [
  { name: "Pop", image: "/figmaAssets/frame-383.png" },
  { name: "Rock" },
  { name: "Hip Hop" },
  { name: "News" },
  { name: "Country" },
  { name: "Hip Hop" },
  { name: "News" },
  { name: "Country" },
];

const popularRadios = [
  {
    name: "VIBRA",
    location: "Italy, Rome",
    image: "/figmaAssets/logo-1.png",
  },
  {
    name: "VOA",
    location: "USA, New York",
    image: "/figmaAssets/c175-1.png",
  },
  {
    name: "Radio L",
    location: "Turkey",
    image: "/figmaAssets/ebg3ye6-1.png",
  },
  {
    name: "Power Türk",
    location: "Turkey, Istanbul",
    image: "/figmaAssets/android-default-logo-1-3.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/meta-image--1--1-4.png",
  },
  {
    name: "Soul Radio",
    location: "USA, Washington D.C",
    image: "/figmaAssets/washington-d-1.png",
  },
  {
    name: "ON 70'S",
    location: "Germany, Bavaria",
    image: "/figmaAssets/germany-bavaria-1.png",
  },
  {
    name: "WEEU",
    location: "USA",
    image: "/figmaAssets/830-weeu-1-1.png",
  },
  {
    name: "Metro FM",
    location: "Turkey, Istanbul",
    image: "/figmaAssets/meta-image--1--1-4.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/meta-image--1--1-4.png",
  },
  {
    name: "Zeno",
    location: "Italy",
    image: "/figmaAssets/apple-icon-120x120-1.png",
  },
  {
    name: "Radio 80'S",
    location: "USA, New York",
    image: "/figmaAssets/80s-radio-1.png",
  },
];

const moreFromAustria = [
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/0b75jzrr-400x400-1-8.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/alem-fm-1-4.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/0b75jzrr-400x400-1-8.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/alem-fm-1-4.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/0b75jzrr-400x400-1-8.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/alem-fm-1-4.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/powertu-rk-tv-logosu-1-12.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/0b75jzrr-400x400-1-8.png",
  },
  {
    name: "Power Türk",
    location: "Türkçe Pop",
    image: "/figmaAssets/alem-fm-1-4.png",
  },
];

const sidebarItems = [
  {
    icon: "/figmaAssets/vuesax-bold-radio.svg",
    label: "Discover",
    active: true,
  },
  {
    icon: "/figmaAssets/vuesax-bold-musicnote.svg",
    label: "Genres",
    active: false,
  },
  {
    icon: "/figmaAssets/vuesax-bold-search-normal.svg",
    label: "Search",
    active: false,
  },
  {
    icon: "/figmaAssets/vuesax-bold-heart.svg",
    label: "Favorites",
    active: false,
  },
  {
    icon: null,
    label: "Records",
    active: false,
    customIcon: true,
  },
  {
    icon: "/figmaAssets/vuesax-bold-setting-2.svg",
    label: "Settings",
    active: false,
  },
];

export const DiscoverUser = (): JSX.Element => {
  return (
    <div className="flex min-h-screen bg-[linear-gradient(156deg,rgba(70,15,40,1)_0%,rgba(14,14,14,1)_100%)] relative overflow-hidden">
      <img
        className="absolute top-0 left-0 w-full h-[769px] object-cover"
        alt="Hand crowd disco"
        src="/figmaAssets/hand-crowd-disco-1.png"
      />

      <img
        className="absolute top-0 left-0 w-full h-[1080px]"
        alt="Frame"
        src="/figmaAssets/frame-1.png"
      />

      <aside className="fixed top-[242px] left-16 flex flex-col gap-2.5 z-10">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-[98px] h-[98px] flex flex-col items-center justify-center gap-2 rounded-[10px] ${
              item.active ? "bg-[#ffffff33]" : ""
            } hover:bg-[#ffffff33]`}
          >
            {item.customIcon ? (
              <div className="w-8 h-8 relative">
                <div className="absolute top-[5px] left-[5px] w-[21px] h-[21px] bg-white rounded-[10.67px]" />
                <div className="absolute top-0 left-0 w-8 h-8 rounded-[20.27px] border-[2.67px] border-solid border-white" />
              </div>
            ) : (
              <img className="w-8 h-8" alt={item.label} src={item.icon || ""} />
            )}
            <span className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-lg">
              {item.label}
            </span>
          </Button>
        ))}
      </aside>

      <main className="flex-1 ml-[230px] relative">
        <header className="fixed top-16 left-[30px] right-[30px] flex items-center justify-between z-10">
          <div className="w-[164px] h-[57px] relative">
            <div className="absolute w-[81.33%] h-[53.85%] top-[46.15%] left-[18.67%] [font-family:'Ubuntu',Helvetica] font-normal text-white text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
              <span className="font-bold">mega</span>
              <span>radio</span>
            </div>
            <img
              className="absolute w-[34.80%] h-[97.16%] top-0 left-0"
              alt="Path"
              src="/figmaAssets/path-8.svg"
            />
          </div>

          <div className="flex items-center gap-[18px]">
            <Button
              variant="ghost"
              className="w-[51px] h-[51px] bg-[#ffffff1a] rounded-[30px] p-0 hover:bg-[#ffffff2a]"
            >
              <div className="flex gap-[2.5px]">
                <div className="w-[6.25px] h-[25px] bg-white rounded-[12.5px]" />
                <div className="w-[6.25px] h-[17.5px] bg-white rounded-[12.5px] mt-[7.5px]" />
                <div className="w-[6.25px] h-[21.25px] bg-white rounded-[12.5px] mt-[3.8px]" />
              </div>
            </Button>

            <Button
              variant="ghost"
              className="h-[51px] bg-[#ffffff1a] rounded-[30px] px-[15px] hover:bg-[#ffffff2a]"
            >
              <div className="flex items-center gap-[10.7px]">
                <img
                  className="w-[28.42px] h-[28.42px] object-cover"
                  alt="Austria"
                  src="/figmaAssets/austria-1.png"
                />
                <span className="font-bold text-2xl [font-family:'Ubuntu',Helvetica] text-white">
                  Austria
                </span>
                <img
                  className="w-[23.68px] h-[23.68px]"
                  alt="Vuesax outline arrow"
                  src="/figmaAssets/vuesax-outline-arrow-left.svg"
                />
              </div>
            </Button>

            <div className="flex items-center gap-[18px]">
              <span className="[font-family:'Ubuntu',Helvetica] font-bold text-white text-2xl">
                Talha Çay
              </span>
              <Avatar className="w-[66px] h-[66px]">
                <AvatarImage src="/figmaAssets/frame-218.png" />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <section className="mt-[242px] px-[230px]">
          <div className="flex items-center justify-between mb-[26px]">
            <h2 className="[font-family:'Ubuntu',Helvetica] font-bold text-white text-[32px]">
              Recently Played
            </h2>
            <Button
              variant="ghost"
              className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px] h-auto p-0 hover:bg-transparent"
            >
              See More
            </Button>
          </div>

          <ScrollArea className="w-full">
            <div className="flex gap-[19px] pb-4">
              {recentlyPlayedStations.map((station, index) => (
                <Card
                  key={index}
                  className={`flex-shrink-0 ${
                    station.featured ? "w-[221px] h-72" : "w-[211px] h-[275px]"
                  } bg-[#ffffff24] rounded-[11px] overflow-hidden shadow-[inset_1.1px_1.1px_12.1px_#ffffff1f] ${
                    station.featured
                      ? "border-[5.75px] border-solid border-[#d2d2d2]"
                      : ""
                  }`}
                >
                  <CardContent className="flex flex-col items-center p-0">
                    <div
                      className={`${
                        station.featured
                          ? "w-[138px] h-[138px] mt-[35.5px]"
                          : "w-[132px] h-[132px] mt-[34px]"
                      } bg-white rounded-[6.6px] overflow-hidden`}
                    >
                      <img
                        className="w-full h-full object-cover"
                        alt={station.name}
                        src={station.image}
                      />
                    </div>
                    <h3
                      className={`[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px] text-center ${
                        station.featured ? "mt-[22.0px]" : "mt-[21px]"
                      }`}
                    >
                      {station.name}
                    </h3>
                    <p
                      className={`[font-family:'Ubuntu',Helvetica] font-light text-white ${
                        station.featured
                          ? "text-[18.8px] mt-[7.6px]"
                          : "text-lg mt-[6.2px]"
                      } text-center`}
                    >
                      {station.location}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="mt-[64px] px-[230px]">
          <h2 className="[font-family:'Ubuntu',Helvetica] font-bold text-white text-[32px] mb-[26px]">
            Popular Genres
          </h2>

          <ScrollArea className="w-full">
            <div className="flex gap-[18px] pb-4">
              {genres.map((genre, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="flex-shrink-0 h-[81px] px-[72px] py-7 bg-[#ffffff24] rounded-[20px] shadow-[inset_1.1px_1.1px_12.1px_#ffffff1f] hover:bg-[#ffffff34]"
                >
                  {genre.image ? (
                    <img
                      className="w-[184px] h-[81px]"
                      alt={genre.name}
                      src={genre.image}
                    />
                  ) : (
                    <span className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px]">
                      {genre.name}
                    </span>
                  )}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="mt-[64px] px-[230px]">
          <div className="flex items-center justify-between mb-[26px]">
            <h2 className="[font-family:'Ubuntu',Helvetica] font-bold text-white text-[32px]">
              Popular Radios
            </h2>
            <Button
              variant="ghost"
              className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px] h-auto p-0 hover:bg-transparent"
            >
              See More
            </Button>
          </div>

          <div className="grid grid-cols-6 gap-[19px]">
            {popularRadios.map((station, index) => (
              <Card
                key={index}
                className="w-[211px] h-[275px] bg-[#ffffff24] rounded-[11px] overflow-hidden shadow-[inset_1.1px_1.1px_12.1px_#ffffff1f]"
              >
                <CardContent className="flex flex-col items-center p-0">
                  <div className="w-[132px] h-[132px] mt-[34px] bg-white rounded-[6.6px] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt={station.name}
                      src={station.image}
                    />
                  </div>
                  <h3 className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px] text-center mt-[21px]">
                    {station.name}
                  </h3>
                  <p className="[font-family:'Ubuntu',Helvetica] font-light text-white text-lg text-center mt-[6.2px]">
                    {station.location}
                  </p>
                </CardContent>
              </Card>
            ))}
            <Card className="w-[211px] h-[275px] bg-[#ffffff24] rounded-[11px] overflow-hidden shadow-[inset_1.1px_1.1px_12.1px_#ffffff1f] flex items-center justify-center">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px] h-auto p-0 hover:bg-transparent"
                >
                  See More
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-[64px] px-[230px] pb-[141px]">
          <div className="flex items-center justify-between mb-[26px]">
            <h2 className="[font-family:'Ubuntu',Helvetica] font-bold text-white text-[32px]">
              More From Austria
            </h2>
            <Button
              variant="ghost"
              className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px] h-auto p-0 hover:bg-transparent"
            >
              See More
            </Button>
          </div>

          <div className="grid grid-cols-6 gap-[19px]">
            {moreFromAustria.map((station, index) => (
              <Card
                key={index}
                className="w-[211px] h-[275px] bg-[#ffffff24] rounded-[11px] overflow-hidden shadow-[inset_1.1px_1.1px_12.1px_#ffffff1f]"
              >
                <CardContent className="flex flex-col items-center p-0">
                  <div className="w-[132px] h-[132px] mt-[34px] bg-white rounded-[6.6px] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt={station.name}
                      src={station.image}
                    />
                  </div>
                  <h3 className="[font-family:'Ubuntu',Helvetica] font-medium text-white text-[22px] text-center mt-[21px]">
                    {station.name}
                  </h3>
                  <p className="[font-family:'Ubuntu',Helvetica] font-light text-white text-lg text-center mt-[6.2px]">
                    {station.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
