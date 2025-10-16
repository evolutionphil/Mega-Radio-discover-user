import { Link } from "wouter";
import { Apple, Facebook, Mail } from "lucide-react";
import { SiGoogle } from "react-icons/si";

export const Login = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-login">
      <div className="absolute left-[712px] top-[235px] w-[496px] h-[609px]">
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
              {/* Apple Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <Apple className="w-[32px] h-[32px] text-white" fill="white" />
              </div>
              <p className="absolute left-[152px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                Login With Apple
              </p>
            </div>
          </Link>

          {/* Login With Facebook */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-[128px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-facebook">
              {/* Facebook Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-[#1877F2] flex items-center justify-center">
                <Facebook className="w-[32px] h-[32px] text-white" fill="white" />
              </div>
              <p className="absolute left-[131.2px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                Login With Facebook
              </p>
            </div>
          </Link>

          {/* Login With Google */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-[256px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-google">
              {/* Google Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-white flex items-center justify-center">
                <SiGoogle className="w-[32px] h-[32px] text-[#4285f4]" />
              </div>
              <p className="absolute left-[145.6px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                Login With Google
              </p>
            </div>
          </Link>

          {/* Login With Mail */}
          <Link href="/login-with-email">
            <div className="absolute left-0 top-[384px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-email">
              {/* Email Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Mail className="w-[32px] h-[32px] text-white" />
              </div>
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
