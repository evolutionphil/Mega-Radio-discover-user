import { Link, useLocation } from "wouter";
import { SkipBack, Pause, Play, SkipForward, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { megaRadioApi, type Station } from "@/services/megaRadioApi";
import { useMemo, useEffect, useRef, useState } from "react";
import { useTVNavigation } from "@/hooks/useTVNavigation";

export const RadioPlaying = (): JSX.Element => {
  useTVNavigation();
  const [location] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  
  // Parse station ID from URL query params - useMemo ensures it updates when location changes
  const stationId = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('station');
  }, [location]); // Re-calculate when location changes

  const sidebarItems = [
    { icon: "/images/vuesax-bold-radio.svg", label: "Discover", active: true, href: "/discover-no-user" },
    { icon: "/images/vuesax-bold-musicnote.svg", label: "Genres", active: false, href: "/genres" },
    { icon: "/images/vuesax-bold-search-normal.svg", label: "Search", active: false, href: "/search" },
    { icon: "/images/vuesax-bold-heart.svg", label: "Favorites", active: false, href: "/favorites" },
    { icon: null, label: "Records", active: false, customIcon: true, href: "/discover-no-user" },
    { icon: "/images/vuesax-bold-setting-2.svg", label: "Settings", active: false, href: "/settings" },
  ];

  // Fallback image as SVG data URI
  const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#01d7fb"/><text x="100" y="120" font-size="80" fill="white" text-anchor="middle" font-family="Arial">R</text></svg>')}`;

  // Helper function to get station image
  const getStationImage = (station: Station) => {
    if (station.favicon) {
      return station.favicon.startsWith('http') 
        ? station.favicon 
        : `https://themegaradio.com/api/image/${encodeURIComponent(station.favicon)}`;
    }
    return FALLBACK_IMAGE;
  };

  // Helper function to get tags as array
  const getStationTags = (station: Station): string[] => {
    if (!station.tags) return [];
    if (Array.isArray(station.tags)) return station.tags;
    return station.tags.split(',').map(tag => tag.trim());
  };

  // Fetch station details
  const { data: stationData, isLoading: isLoadingStation } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => megaRadioApi.getStationById(stationId!),
    enabled: !!stationId,
  });

  const station = stationData?.station;

  // Fetch station metadata (now playing)
  const { data: metadataData } = useQuery({
    queryKey: ['metadata', stationId],
    queryFn: () => megaRadioApi.getStationMetadata(stationId!),
    enabled: !!stationId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const metadata = metadataData?.metadata;

  // Fetch similar stations using the dedicated API endpoint
  const { data: similarStationsData } = useQuery({
    queryKey: ['similar', stationId],
    queryFn: () => megaRadioApi.getSimilarStations(stationId!, 7),
    enabled: !!stationId,
  });

  // Fetch popular stations
  const { data: popularStationsData } = useQuery({
    queryKey: ['popular-stations'],
    queryFn: () => megaRadioApi.getPopularStations({ limit: 14 }),
  });

  const similarStations = similarStationsData?.stations || [];
  const popularStations = popularStationsData?.stations || [];

  // Initialize TV audio player
  useEffect(() => {
    // Check if TVAudioPlayer is available (loaded from global script)
    if (typeof (window as any).TVAudioPlayer !== 'undefined') {
      // Initialize player
      audioPlayerRef.current = new (window as any).TVAudioPlayer('tv-audio-container');
      
      // Set up event handlers
      audioPlayerRef.current.onPlay = () => {
        setIsPlaying(true);
        setIsBuffering(false);
      };
      
      audioPlayerRef.current.onPause = () => {
        setIsPlaying(false);
      };
      
      audioPlayerRef.current.onStop = () => {
        setIsPlaying(false);
      };
      
      audioPlayerRef.current.onBuffering = () => {
        setIsBuffering(true);
      };
      
      audioPlayerRef.current.onReady = () => {
        setIsBuffering(false);
      };
      
      audioPlayerRef.current.onError = (error: any) => {
        console.error('[RadioPlaying] Audio player error:', error);
        console.error('[RadioPlaying] Error details:', {
          stationId,
          stationName: station?.name,
          stationUrl: station?.url,
          errorType: error?.type,
          errorMessage: error?.message
        });
        setIsPlaying(false);
        setIsBuffering(false);
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stop();
      }
    };
  }, []);

  // Auto-play when station changes
  useEffect(() => {
    if (station && station.url && audioPlayerRef.current) {
      console.log('[RadioPlaying] Playing station:', {
        id: station._id,
        name: station.name,
        url: station.url,
        url_resolved: station.url_resolved,
        codec: station.codec,
        bitrate: station.bitrate
      });
      
      // Try url_resolved first, then fall back to url
      const streamUrl = station.url_resolved || station.url;
      console.log('[RadioPlaying] Using stream URL:', streamUrl);
      
      // Note: play() doesn't return a Promise in our implementation
      // Errors are handled through the onError callback
      audioPlayerRef.current.play(streamUrl);
    }
  }, [station]);

  // Playback control handlers
  const handlePlayPause = () => {
    if (!audioPlayerRef.current) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      if (station?.url) {
        audioPlayerRef.current.play(station.url);
      }
    }
  };

  const handlePrevious = () => {
    // Navigate to previous similar station
    if (similarStations.length > 0) {
      const currentIndex = similarStations.findIndex(s => s._id === stationId);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : similarStations.length - 1;
      window.location.href = `/radio-playing?station=${similarStations[prevIndex]._id}`;
    }
  };

  const handleNext = () => {
    // Navigate to next similar station
    if (similarStations.length > 0) {
      const currentIndex = similarStations.findIndex(s => s._id === stationId);
      const nextIndex = currentIndex < similarStations.length - 1 ? currentIndex + 1 : 0;
      window.location.href = `/radio-playing?station=${similarStations[nextIndex]._id}`;
    }
  };

  return (
    <div className="relative w-[1920px] min-h-[1080px] bg-[#0e0e0e] overflow-y-auto pb-[50px]">
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-20 blur-[80px] scale-110"
          alt="Background"
          src={station ? getStationImage(station) : '/images/meta-image--1--1-4.png'}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e]/60 to-[#0e0e0e]/90" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Logo */}
      <div className="absolute left-[31px] top-[64px] w-[164.421px] h-[57px]">
        <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] text-white leading-normal whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/images/path-8.svg"
        />
      </div>

      {/* User Profile */}
      <div className="absolute left-[1648px] top-[59px] w-[193px] h-[66px]">
        <p className="absolute left-[54.5px] top-[19px] font-['Ubuntu',Helvetica] font-bold text-[24px] text-center text-white leading-normal -translate-x-1/2">
          Talha Çay
        </p>
        <div className="absolute left-[127px] top-0 w-[66px] h-[66px] rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="User"
            src="/images/frame-218.png"
          />
        </div>
      </div>

      {/* Country Selector */}
      <div className="absolute left-[1351px] top-[67px] w-[223px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <div className="absolute left-[15px] top-[11px] w-[193.684px] h-[29px]">
          <p className="absolute left-[39.08px] top-px font-['Ubuntu',Helvetica] font-bold text-[24px] text-white leading-normal">
            Austria
          </p>
          <img
            className="absolute left-0 top-0 w-[28.421px] h-[28.421px]"
            alt="Austria"
            src="/images/austria-1.png"
          />
          <div className="absolute left-[170px] top-[3.32px] rotate-[270deg]">
            <img
              className="w-[23.684px] h-[23.684px]"
              alt="Arrow"
              src="/images/vuesax-outline-arrow-left.svg"
            />
          </div>
        </div>
      </div>

      {/* Equalizer Icon */}
      <div className="absolute left-[1281px] top-[67px] w-[51px] h-[51px] bg-[rgba(255,255,255,0.1)] rounded-[30px]">
        <div className="absolute left-[13.75px] top-[13px] w-[23.75px] h-[25px]">
          <div className="absolute left-0 top-0 w-[6.25px] h-[25px] bg-white rounded-[10px]" />
          <div className="absolute left-[8.75px] top-[7.5px] w-[6.25px] h-[17.5px] bg-white rounded-[10px]" />
          <div className="absolute left-[17.5px] top-[3.75px] w-[6.25px] h-[21.25px] bg-white rounded-[10px]" />
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-[64px] top-[242px] w-[98px] h-[638px]">
        {sidebarItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div
              className={`absolute left-0 w-[98px] h-[98px] rounded-[10px] overflow-clip cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors ${
                item.active ? "bg-[rgba(255,255,255,0.2)]" : ""
              }`}
              style={{ top: `${index * 108}px` }}
              data-testid={`button-${item.label.toLowerCase()}`}
              data-tv-focusable="true"
            >
              <div className="absolute left-1/2 top-[19px] -translate-x-1/2">
                {item.customIcon ? (
                  <div className="w-[32px] h-[32px] relative">
                    <div className="absolute left-[5.33px] top-[5.33px] w-[21.334px] h-[21.334px] bg-white rounded-[10.667px]" />
                    <div className="absolute left-0 top-0 w-[32px] h-[32px] rounded-[20.267px] border-[2.667px] border-solid border-white" />
                  </div>
                ) : (
                  <img className="w-[32px] h-[32px]" alt={item.label} src={item.icon || ""} />
                )}
              </div>
              <p className="absolute left-1/2 top-[59px] font-['Ubuntu',Helvetica] font-medium text-[18px] text-center text-white leading-normal -translate-x-1/2">
                {item.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Radio Logo */}
      <div className="absolute left-[236px] top-[242px] w-[296px] h-[296px] bg-white rounded-[16.692px] overflow-hidden">
        <img
          className="w-full h-full object-cover"
          alt="Radio Logo"
          src={station ? getStationImage(station) : '/images/meta-image--1--1-4.png'}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Station Name */}
      <p className="absolute left-[596px] top-[293px] font-['Ubuntu',Helvetica] font-medium text-[48px] text-white leading-normal" data-testid="text-station-name">
        {station?.name || 'Loading...'}
      </p>

      {/* Equalizer Icon (next to station name) */}
      <div className="absolute left-[596px] top-[242px] w-[33.25px] h-[35px]">
        <div className="absolute left-0 top-0 w-[8.75px] h-[35px] bg-[#ff4199] rounded-[10px]" />
        <div className="absolute left-[12.25px] top-[10.5px] w-[8.75px] h-[24.5px] bg-[#ff4199] rounded-[10px]" />
        <div className="absolute left-[24.5px] top-[5.25px] w-[8.75px] h-[29.75px] bg-[#ff4199] rounded-[10px]" />
      </div>

      {/* Song Name */}
      <p className="absolute left-[596px] top-[356.71px] font-['Ubuntu',Helvetica] font-medium text-[32px] text-white leading-normal" data-testid="text-song-name">
        {station ? (getStationTags(station)[0] || station?.country || 'Radio Station') : 'Loading...'}
      </p>

      {/* Station Info Label */}
      <p className="absolute left-[596px] top-[425px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal" data-testid="text-station-info">
        Station Info
      </p>

      {/* Country Flag */}
      <img
        className="absolute left-[596px] top-[479.48px] w-[34.783px] h-[34.783px]"
        alt={station?.country || "Country"}
        src="/images/austria-1.png"
      />

      {/* Station Info Tags */}
      <div className="absolute left-[646.43px] top-[476px] h-[40px] min-w-[93.913px] px-3 bg-[#242424] rounded-[5.217px]" data-testid="tag-bitrate">
        <p className="absolute left-1/2 top-[6.96px] font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-center text-white leading-normal -translate-x-1/2 whitespace-nowrap">
          {station?.bitrate ? `${station.bitrate}kb` : 'N/A'}
        </p>
      </div>
      <div className="absolute left-[757.74px] top-[476px] h-[40px] min-w-[93.913px] px-3 bg-[#242424] rounded-[5.217px]" data-testid="tag-format">
        <p className="absolute left-1/2 top-[6.96px] font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-center text-white leading-normal -translate-x-1/2 whitespace-nowrap">
          {station?.codec || 'N/A'}
        </p>
      </div>
      <div className="absolute left-[869.04px] top-[476px] h-[40px] min-w-[93.913px] px-3 bg-[#242424] rounded-[5.217px]" data-testid="tag-country">
        <p className="absolute left-1/2 top-[6.96px] font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-center text-white leading-normal -translate-x-1/2 whitespace-nowrap">
          {station?.countryCode || station?.countrycode || 'N/A'}
        </p>
      </div>
      {station && getStationTags(station).slice(0, 2).map((tag, index) => (
        <div 
          key={index}
          className="absolute h-[40px] min-w-[109.565px] px-3 bg-[#242424] rounded-[5.217px]" 
          style={{ left: `${980.35 + (index * 126.95)}px`, top: '476px' }}
          data-testid={`tag-genre-${tag}`}
        >
          <p className="absolute left-1/2 top-[6.96px] font-['Ubuntu',Helvetica] font-medium text-[24.348px] text-center text-white leading-normal -translate-x-1/2 whitespace-nowrap">
            {tag}
          </p>
        </div>
      ))}

      {/* Playback Controls */}
      <div className="absolute left-[1372px] top-[356px] w-[469px] h-[90.192px]">
        {/* Previous Button */}
        <button 
          onClick={handlePrevious}
          className="absolute left-0 top-0 w-[90.192px] h-[90.192px] bg-black rounded-[45.096px] flex items-center justify-center hover:bg-gray-800 transition-colors" 
          data-testid="button-previous"
          data-tv-focusable="true"
        >
          <SkipBack className="w-[40px] h-[40px] text-white" fill="white" />
        </button>

        {/* Play/Pause Button */}
        <button 
          onClick={handlePlayPause}
          className="absolute left-[126.27px] top-0 w-[90.192px] h-[90.192px] bg-black rounded-[45.096px] flex items-center justify-center hover:bg-gray-800 transition-colors" 
          data-testid="button-pause"
          data-tv-focusable="true"
        >
          {isBuffering ? (
            <div className="w-[40px] h-[40px] border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-[40px] h-[40px] text-white" fill="white" />
          ) : (
            <Play className="w-[40px] h-[40px] text-white" fill="white" />
          )}
        </button>

        {/* Next Button */}
        <button 
          onClick={handleNext}
          className="absolute left-[252.54px] top-0 w-[90.192px] h-[90.192px] bg-black rounded-[45.096px] flex items-center justify-center hover:bg-gray-800 transition-colors" 
          data-testid="button-next"
          data-tv-focusable="true"
        >
          <SkipForward className="w-[40px] h-[40px] text-white" fill="white" />
        </button>

        {/* Favorite Button */}
        <button className="absolute left-[378.81px] top-0 w-[90.192px] h-[90.192px] border-[3.608px] border-black border-solid rounded-[72.655px] flex items-center justify-center hover:border-gray-700 transition-colors" data-testid="button-favorite" data-tv-focusable="true">
          <Heart className="w-[40px] h-[40px] text-white" fill="white" />
        </button>
      </div>

      {/* Similar Radios Section */}
      <p className="absolute left-[236px] top-[659px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        Similar Radios
      </p>
      <p className="absolute left-[1792.5px] top-[665px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal -translate-x-1/2 cursor-pointer hover:text-gray-300" data-tv-focusable="true">
        See More
      </p>

      <div className="absolute left-[236px] top-[733px] flex gap-[19px]">
        {similarStations.map((station, index) => {
          const isFeatured = index === 2;
          return (
            <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
              <div
                className={`bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors ${
                  isFeatured
                    ? "w-[209.091px] h-[276px] border-[5.75px] border-solid border-[#d2d2d2]"
                    : "w-[200px] h-[264px]"
                }`}
                data-testid={`card-similar-${station._id}`}
                data-tv-focusable="true"
              >
                <div className={`bg-white ${isFeatured ? "w-[138px] h-[138px] mt-[35.55px] ml-[35.55px]" : "w-[132px] h-[132px] mt-[34px] ml-[34px]"} rounded-[6.6px] overflow-clip`}>
                  <img
                    className="w-full h-full object-cover"
                    alt={station.name}
                    src={getStationImage(station)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <p className={`font-['Ubuntu',Helvetica] font-medium ${isFeatured ? "text-[22px] mt-[22px]" : "text-[22px] mt-[21px]"} text-center text-white leading-normal truncate px-2`}>
                  {station.name}
                </p>
                <p className={`font-['Ubuntu',Helvetica] font-light ${isFeatured ? "text-[18.818px] mt-[7.6px]" : "text-[18px] mt-[6.2px]"} text-center text-white leading-normal truncate px-2`}>
                  {getStationTags(station)[0] || station.country || 'Radio'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Popular Radios Section */}
      <p className="absolute left-[236px] top-[1095px] font-['Ubuntu',Helvetica] font-bold text-[32px] text-white leading-normal">
        Popular Radios
      </p>
      <p className="absolute left-[1792.5px] top-[1101px] font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal -translate-x-1/2 cursor-pointer hover:text-gray-300" data-tv-focusable="true">
        See More
      </p>

      <div className="absolute left-[236px] top-[1169px] grid grid-cols-6 gap-x-[19px] gap-y-[19px] w-[1580px]">
        {popularStations.map((station, index) => (
          <Link key={station._id || index} href={`/radio-playing?station=${station._id}`}>
            <div
              className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors"
              data-testid={`card-popular-${station._id}`}
              data-tv-focusable="true"
            >
              <div className="w-[132px] h-[132px] mt-[34px] mx-auto bg-white rounded-[6.6px] overflow-clip">
                <img
                  className="w-full h-full object-cover"
                  alt={station.name}
                  src={getStationImage(station)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal mt-[21px] truncate px-2">
                {station.name}
              </p>
              <p className="font-['Ubuntu',Helvetica] font-light text-[18px] text-center text-white leading-normal mt-[6.2px] truncate px-2">
                {getStationTags(station)[0] || station.country || 'Radio'}
              </p>
            </div>
          </Link>
        ))}
        <div className="w-[200px] h-[264px] bg-[rgba(255,255,255,0.14)] rounded-[11px] overflow-clip shadow-[inset_1.1px_1.1px_12.1px_0px_rgba(255,255,255,0.12)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.2)] transition-colors" data-testid="button-see-more" data-tv-focusable="true">
          <p className="font-['Ubuntu',Helvetica] font-medium text-[22px] text-center text-white leading-normal">
            See More
          </p>
        </div>
      </div>
      </div>
      
      {/* Hidden Audio Player Container for TV platforms */}
      <div id="tv-audio-container" className="hidden"></div>
    </div>
  );
};
