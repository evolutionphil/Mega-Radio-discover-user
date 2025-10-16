export const RadioPlaying = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden">
      {/* Background with blur */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover blur-[100px] scale-110"
          alt="Background"
          src="/figmaAssets/cnn-international-logo-1.png"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Logo */}
      <div className="absolute left-[30px] top-[64px] w-[164.421px] h-[57px]">
        <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[27.029px] text-white leading-normal whitespace-pre-wrap">
          <span className="font-bold">mega</span>radio
        </p>
        <img
          className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
          alt="Path"
          src="/figmaAssets/path-8.svg"
        />
      </div>

      {/* Main Player Card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px]">
        {/* Station Logo */}
        <div className="mx-auto mb-12 w-[400px] h-[400px] bg-white/10 rounded-[30px] overflow-hidden backdrop-blur-md">
          <img
            className="w-full h-full object-cover"
            alt="Station"
            src="/figmaAssets/cnn-international-logo-1.png"
          />
        </div>

        {/* Station Info */}
        <div className="text-center mb-8">
          <h1 className="font-['Ubuntu',Helvetica] font-bold text-[48px] text-white mb-2" data-testid="text-station-name">
            CNN International
          </h1>
          <p className="font-['Ubuntu',Helvetica] font-medium text-[24px] text-[#9b9b9b]" data-testid="text-station-location">
            International
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-12">
          <button className="w-[70px] h-[70px] bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors" data-testid="button-previous">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 24L12 16L20 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button className="w-[90px] h-[90px] bg-[#ff4199] rounded-full flex items-center justify-center hover:bg-[#e6398a] transition-colors" data-testid="button-play-pause">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="10" width="5" height="20" fill="white" rx="1"/>
              <rect x="23" y="10" width="5" height="20" fill="white" rx="1"/>
            </svg>
          </button>

          <button className="w-[70px] h-[70px] bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors" data-testid="button-next">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8L20 16L12 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 5.25v17.5M9.625 10.5v7M18.375 10.5v7M4.375 12.25v3.5M23.625 12.25v3.5" stroke="#9b9b9b" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div className="w-[400px] h-[6px] bg-white/20 rounded-full">
            <div className="w-[60%] h-full bg-[#ff4199] rounded-full" />
          </div>
        </div>
      </div>

      {/* Favorite Button */}
      <button className="absolute right-[60px] top-[64px] w-[60px] h-[60px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="button-favorite">
        <img
          className="w-[32px] h-[32px]"
          alt="Favorite"
          src="/figmaAssets/vuesax-bold-heart.svg"
        />
      </button>

      {/* Back Button */}
      <button className="absolute left-[60px] bottom-[60px] flex items-center gap-3 text-white/70 hover:text-white transition-colors" data-testid="button-back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-['Ubuntu',Helvetica] font-medium text-[20px]">Back to Discover</span>
      </button>
    </div>
  );
};
