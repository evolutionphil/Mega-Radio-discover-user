import { Link } from "wouter";

export const Login = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-login">
      <div className="absolute left-[768px] top-[339px] w-[385px] h-[402px]">
        {/* Logo */}
        <div className="absolute left-[150px] top-0 w-[195px] h-[67.601px]">
          <p className="absolute bottom-0 left-[18.67%] right-0 top-[46.16%] font-['Ubuntu',Helvetica] text-[32.055px] text-white leading-normal whitespace-pre-wrap">
            <span className="font-bold">mega</span>radio
          </p>
          <img
            className="absolute left-0 bottom-[2.84%] w-[34.8%] h-[97.16%]"
            alt="Path"
            src="/figmaAssets/path-8.svg"
          />
        </div>

        {/* Login Buttons Container */}
        <div className="absolute left-0 top-[129px] w-[496px] h-[480px]">
          {/* Login With Apple */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-0 w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-apple">
            <img
              className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px]"
              alt="Apple"
              src="/figmaAssets/social-media-apple.svg"
            />
            <p className="absolute left-[152px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
              Login With Apple
            </p>
            </div>
          </Link>

          {/* Login With Facebook */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-[128px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-facebook">
            <img
              className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px]"
              alt="Facebook"
              src="/figmaAssets/social-media-facebook.svg"
            />
            <p className="absolute left-[131.2px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
              Login With Facebook
            </p>
            </div>
          </Link>

          {/* Login With Google */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-[256px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-google">
            <img
              className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px]"
              alt="Google"
              src="/figmaAssets/social-media-google.svg"
            />
            <p className="absolute left-[145.6px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
              Login With Google
            </p>
            </div>
          </Link>

          {/* Login With Mail */}
          <Link href="/login-with-email">
            <div className="absolute left-0 top-[384px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-email">
            <img
              className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px]"
              alt="Email"
              src="/figmaAssets/social-media-email.svg"
            />
            <img
              className="absolute left-[28.8px] top-[28.8px] w-[38.4px] h-[38.4px]"
              alt="SMS"
              src="/figmaAssets/vuesax-bold-sms.svg"
            />
            <p className="absolute left-[161.6px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
              Login With Mail
            </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
