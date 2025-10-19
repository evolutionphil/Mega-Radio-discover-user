import { Link } from "wouter";
import { Undo2, Mail, Lock } from "lucide-react";
import { useLocalization } from "@/contexts/LocalizationContext";

export const LoginWithEmail = (): JSX.Element => {
  const { t } = useLocalization();
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-login-email">
      {/* Back Button */}
      <Link href="/login">
        <div className="absolute left-[476px] top-[50px] w-[71px] h-[24px] cursor-pointer hover:opacity-80 transition-opacity" data-testid="button-back">
          <p className="absolute left-[28px] top-[1px] font-['Ubuntu',Helvetica] font-medium text-[19.027px] text-[#c8c8c8] leading-normal">
            {t('back')}
          </p>
          <Undo2 className="absolute left-0 top-0 w-[24px] h-[24px] text-[#c8c8c8]" />
        </div>
      </Link>

      {/* Title */}
      <p className="absolute left-[960.5px] top-[119px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-bold text-[32px] text-center text-white leading-normal" data-testid="title-login-email">
        {t('auth_login_with_email')}
      </p>

      {/* Email Input */}
      <div 
        className="absolute left-[476px] top-[205px] w-[968px] h-[75px] bg-[rgba(255,255,255,0.2)] rounded-[12px] border-[5.59px] border-solid border-[#d2d2d2] overflow-clip backdrop-blur-[13.621px]"
        data-testid="input-email"
      >
        <Mail className="absolute left-[20px] top-[18px] w-[38px] h-[38px] text-white" />
        <p className="absolute left-[77px] top-[21.84px] font-['Ubuntu',Helvetica] font-medium text-[25.945px] text-white leading-normal">
          talhacay@gm
        </p>
      </div>

      {/* Password Input */}
      <div 
        className="absolute left-[476px] top-[300px] w-[968px] h-[75px] bg-[rgba(255,255,255,0.2)] rounded-[12px] border-[2.594px] border-solid border-[#717171] overflow-clip backdrop-blur-[13.621px]"
        data-testid="input-password"
      >
        <Lock className="absolute left-[20px] top-[18px] w-[38px] h-[38px] text-[#7e7e7e]" />
        <p className="absolute left-[77px] top-[21.84px] font-['Ubuntu',Helvetica] font-medium text-[25.945px] text-[#7e7e7e] leading-normal">
          {t('auth_password_label')}
        </p>
      </div>

      {/* Login Button */}
      <Link href="/guide-1">
        <div 
          className="absolute left-[476px] top-[395px] w-[968px] h-[75px] bg-[#ff4199] rounded-[12px] overflow-clip cursor-pointer hover:bg-[#e6398a] transition-colors backdrop-blur-[13.621px]"
          data-testid="button-login"
        >
          <p className="absolute left-[451px] top-[21.84px] font-['Ubuntu',Helvetica] font-medium text-[25.945px] text-white leading-normal">
            {t('login')}
          </p>
        </div>
      </Link>

      {/* Forgot Password Link */}
      <Link href="/forgot-password">
        <p className="absolute left-[476px] top-[530px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal cursor-pointer hover:text-[#ff4199] transition-colors" data-testid="link-forgot-password">
          {t('auth_forgot_password')}
        </p>
      </Link>

      {/* Sign Up Link */}
      <p className="absolute left-[1444px] top-[530px] -translate-x-full font-['Ubuntu',Helvetica] font-medium text-[24px] text-right text-[#ff4199] leading-normal cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-signup">
        {t('auth_no_account_signup')}
      </p>

      {/* Native Keyboard Placeholder */}
      <div className="absolute left-[476px] top-[618px] w-[968px] h-[378px] bg-[#313131] rounded-[14px] overflow-clip" data-testid="keyboard-placeholder">
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Roboto',Helvetica] font-medium text-[25.945px] text-center text-[#656565] leading-normal">
          Native keyboard
        </p>
      </div>
    </div>
  );
};
