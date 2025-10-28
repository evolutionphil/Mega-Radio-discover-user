import { useEffect, useState } from 'react';
import { useGlobalPlayer } from '@/contexts/GlobalPlayerContext';
import { assetPath } from '@/lib/assetPath';

interface IdleScreensaverProps {
  isVisible: boolean;
  onInteraction?: () => void;
}

export const IdleScreensaver = ({ isVisible, onInteraction }: IdleScreensaverProps): JSX.Element | null => {
  const { currentStation, isPlaying, nowPlayingMetadata } = useGlobalPlayer();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeIn, setFadeIn] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fade in animation when becoming visible
  useEffect(() => {
    if (isVisible) {
      // Small delay before fading in
      const timeout = setTimeout(() => setFadeIn(true), 100);
      return () => clearTimeout(timeout);
    } else {
      setFadeIn(false);
    }
  }, [isVisible]);

  // Don't render if not visible or no station playing
  if (!isVisible || !currentStation) {
    return null;
  }

  const FALLBACK_IMAGE = assetPath('images/fallback-station.png');

  const getStationImage = (station: typeof currentStation) => {
    if (station.favicon && station.favicon !== 'null' && station.favicon.trim() !== '') {
      return station.favicon.startsWith('http') 
        ? station.favicon 
        : `https://themegaradio.com/api/image/${encodeURIComponent(station.favicon)}`;
    }
    return FALLBACK_IMAGE;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div 
      className={`fixed inset-0 w-[1920px] h-[1080px] bg-black z-[9999] flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onInteraction}
      data-testid="idle-screensaver"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0a1a] to-black opacity-80" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-16">
        
        {/* Large Animated Equalizer */}
        <div className="relative">
          <div className="flex items-end justify-center gap-8 h-[300px]">
            {/* Bar 1 */}
            <div 
              className={`bg-gradient-to-t from-[#ff4199] to-[#ff6bb3] w-[60px] rounded-[20px] ${
                isPlaying ? 'animate-screensaver-equalizer-1' : 'h-[300px]'
              }`}
              style={{ height: isPlaying ? undefined : '300px' }}
            />
            {/* Bar 2 */}
            <div 
              className={`bg-gradient-to-t from-[#ff4199] to-[#ff6bb3] w-[60px] rounded-[20px] ${
                isPlaying ? 'animate-screensaver-equalizer-2' : 'h-[200px]'
              }`}
              style={{ height: isPlaying ? undefined : '200px' }}
            />
            {/* Bar 3 */}
            <div 
              className={`bg-gradient-to-t from-[#ff4199] to-[#ff6bb3] w-[60px] rounded-[20px] ${
                isPlaying ? 'animate-screensaver-equalizer-3' : 'h-[250px]'
              }`}
              style={{ height: isPlaying ? undefined : '250px' }}
            />
            {/* Bar 4 */}
            <div 
              className={`bg-gradient-to-t from-[#ff4199] to-[#ff6bb3] w-[60px] rounded-[20px] ${
                isPlaying ? 'animate-screensaver-equalizer-2' : 'h-[180px]'
              }`}
              style={{ height: isPlaying ? undefined : '180px' }}
            />
            {/* Bar 5 */}
            <div 
              className={`bg-gradient-to-t from-[#ff4199] to-[#ff6bb3] w-[60px] rounded-[20px] ${
                isPlaying ? 'animate-screensaver-equalizer-1' : 'h-[280px]'
              }`}
              style={{ height: isPlaying ? undefined : '280px' }}
            />
          </div>
        </div>

        {/* Station Info */}
        <div className="flex flex-col items-center gap-8">
          {/* Station Logo */}
          <div className="bg-white rounded-[12px] size-[200px] overflow-clip shadow-2xl">
            <img 
              src={getStationImage(currentStation)}
              alt={currentStation.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>

          {/* Station Name */}
          <h1 className="font-['Ubuntu',Helvetica] font-bold text-[56px] text-white text-center max-w-[1200px] truncate">
            {currentStation.name}
          </h1>

          {/* Now Playing */}
          {nowPlayingMetadata && (
            <div className="flex items-center gap-4">
              <div className="w-[60px] h-[3px] bg-[#ff4199]" />
              <p className="font-['Ubuntu',Helvetica] font-light text-[36px] text-[#ff4199] text-center max-w-[1000px] truncate">
                {nowPlayingMetadata}
              </p>
              <div className="w-[60px] h-[3px] bg-[#ff4199]" />
            </div>
          )}

          {/* Country */}
          <p className="font-['Ubuntu',Helvetica] font-light text-[28px] text-white/70">
            {currentStation.country}
          </p>
        </div>

        {/* Large Clock */}
        <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2">
          <p className="font-['Ubuntu',Helvetica] font-light text-[72px] text-white/50 tracking-wider">
            {formatTime(currentTime)}
          </p>
        </div>

        {/* Hint Text */}
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2">
          <p className="font-['Ubuntu',Helvetica] font-light text-[20px] text-white/30 text-center animate-pulse">
            Press any button to continue
          </p>
        </div>
      </div>
    </div>
  );
};
