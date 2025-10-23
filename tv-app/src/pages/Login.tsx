import { Link } from "wouter";
import { Apple, Facebook, Mail } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useEffect } from "react";
import { assetPath } from "@/lib/assetPath";

export const Login = (): JSX.Element => {
  useTVNavigation();
  const { t } = useLocalization();

  // Set initial focus on Login with Apple button
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((window as any).TVNavigation) {
        const firstButton = document.querySelector('[data-testid="button-login-apple"]') as HTMLElement;
        if (firstButton && (window as any).TVNavigation.focusElement) {
          (window as any).TVNavigation.focusElement(firstButton);
        }
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

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
            src={assetPath("images/path-8.svg")}
          />
        </div>

        {/* Login Buttons Container */}
        <div className="absolute left-0 top-[129px] w-[496px] h-[480px]">
          {/* Login With Apple */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-0 w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-apple" data-tv-focusable="true">
              {/* Apple Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <Apple className="w-[32px] h-[32px] text-white" fill="white" />
              </div>
              <p className="absolute left-[152px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                {t('auth_continue_with_apple')}
              </p>
            </div>
          </Link>

          {/* Login With Facebook */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-[128px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-facebook" data-tv-focusable="true">
              {/* Facebook Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-[#1877F2] flex items-center justify-center">
                <Facebook className="w-[32px] h-[32px] text-white" fill="white" />
              </div>
              <p className="absolute left-[131.2px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                {t('auth_continue_with_facebook')}
              </p>
            </div>
          </Link>

          {/* Login With Google */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-[256px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-google" data-tv-focusable="true">
              {/* Google Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-white flex items-center justify-center">
                <SiGoogle className="w-[32px] h-[32px] text-[#4285f4]" />
              </div>
              <p className="absolute left-[145.6px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                {t('auth_continue_with_google')}
              </p>
            </div>
          </Link>

          {/* Login With Mail */}
          <Link href="/login-with-email">
            <div className="absolute left-0 top-[384px] w-[496px] h-[96px] rounded-[48px] border-[3.2px] border-solid border-[#545454] overflow-clip cursor-pointer hover:bg-white/5 transition-colors" data-testid="button-login-email" data-tv-focusable="true">
              {/* Email Icon Background Circle */}
              <div className="absolute left-[17.6px] top-[17.6px] w-[60.8px] h-[60.8px] rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Mail className="w-[32px] h-[32px] text-white" />
              </div>
              <p className="absolute left-[161.6px] top-[33.6px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                {t('auth_continue_with_email')}
              </p>
            </div>
          </Link>

          {/* Continue Without Login - Shows Guide Pages First */}
          <Link href="/guide-1">
            <div className="absolute left-0 top-[512px] w-[496px] h-[96px] rounded-[48px] bg-[rgba(255,255,255,0.1)] overflow-clip cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition-colors" data-testid="button-continue-without-login" data-tv-focusable="true">
              <p className="absolute left-1/2 top-[33.6px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal">
                {t('continue_without_login')}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
