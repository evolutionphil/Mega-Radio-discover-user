import { Link } from "wouter";

export const LoginWithEmail = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-login-email">
      {/* Back Button */}
      <Link href="/login">
        <div className="absolute left-[476px] top-[50px] w-[71px] h-[24px] cursor-pointer" data-testid="button-back">
        <p className="absolute left-[28px] top-[1px] font-['Ubuntu',Helvetica] font-medium text-[19.027px] text-[#c8c8c8] leading-normal">
          Back
        </p>
        <img
          className="absolute left-0 top-0 w-[24px] h-[24px]"
          alt="Back"
          src="/figmaAssets/vuesax-linear-undo.svg"
        />
        </div>
      </Link>

      {/* Title */}
      <p className="absolute left-[960.5px] top-[119px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-bold text-[32px] text-center text-white leading-normal" data-testid="title-login-email">
        Login with email
      </p>

      {/* Email Input */}
      <div 
        className="absolute left-[476px] top-[205px] w-[968px] h-[75px] bg-[rgba(255,255,255,0.2)] rounded-[12px] border-[5.59px] border-solid border-[#d2d2d2] overflow-clip"
        style={{ backdropFilter: 'blur(13.621px)' }}
        data-testid="input-email"
      >
        <img
          className="absolute left-[20px] top-[18px] w-[38px] h-[38px]"
          alt="Email"
          src="/figmaAssets/vuesax-bold-sms.svg"
        />
        <p className="absolute left-[77px] top-[21.84px] font-['Ubuntu',Helvetica] font-medium text-[25.945px] text-white leading-normal">
          talhacay@gm
        </p>
      </div>

      {/* Password Input */}
      <div 
        className="absolute left-[476px] top-[300px] w-[968px] h-[75px] bg-[rgba(255,255,255,0.2)] rounded-[12px] border-[2.594px] border-solid border-[#717171] overflow-clip"
        style={{ backdropFilter: 'blur(13.621px)' }}
        data-testid="input-password"
      >
        <img
          className="absolute left-[20px] top-[18px] w-[38px] h-[38px]"
          alt="Lock"
          src="/figmaAssets/vuesax-bold-lock.svg"
        />
        <p className="absolute left-[77px] top-[21.84px] font-['Ubuntu',Helvetica] font-medium text-[25.945px] text-[#7e7e7e] leading-normal">
          Password
        </p>
      </div>

      {/* Login Button */}
      <Link href="/guide-1">
        <div 
          className="absolute left-[476px] top-[395px] w-[968px] h-[75px] bg-[#ff4199] rounded-[12px] overflow-clip cursor-pointer hover:bg-[#e6398a] transition-colors"
          style={{ backdropFilter: 'blur(13.621px)' }}
          data-testid="button-login"
        >
        <p className="absolute left-[451px] top-[21.84px] font-['Ubuntu',Helvetica] font-medium text-[25.945px] text-white leading-normal">
          Login
        </p>
        </div>
      </Link>

      {/* Forgot Password Link */}
      <Link href="/forgot-password">
        <p className="absolute left-[476px] top-[530px] font-['Ubuntu',Helvetica] font-medium text-[24px] text-white leading-normal cursor-pointer hover:text-[#ff4199] transition-colors" data-testid="link-forgot-password">
        Forgot your password?
        </p>
      </Link>

      {/* Sign Up Link */}
      <p className="absolute left-[1444px] top-[530px] -translate-x-full font-['Ubuntu',Helvetica] font-medium text-[24px] text-right text-[#ff4199] leading-normal cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-signup">
        Don't you have an account?
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
