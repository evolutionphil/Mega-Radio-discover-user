import { Link } from "wouter";
import { assetPath } from "@/lib/assetPath";

export const MailSent = (): JSX.Element => {
  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#0e0e0e] overflow-hidden" data-testid="page-mail-sent">
      <div className="absolute left-[768px] top-[339px] w-[385px] h-[402px]">
        {/* Success Icon */}
        <img
          className="absolute left-[159px] top-0 w-[66px] h-[66px]"
          alt="Success"
          src={assetPath("images/vuesax-linear-tick-circle.svg")}
        />

        {/* Message */}
        <div className="absolute left-[192.5px] top-[90px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-bold text-[40px] text-center text-white leading-normal whitespace-nowrap">
          <p className="mb-0">We sent you</p>
          <p>an activition mail!</p>
        </div>

        {/* Submessage */}
        <p className="absolute left-[192px] top-[216px] -translate-x-1/2 font-['Ubuntu',Helvetica] font-medium text-[32px] text-center text-[#bdbdbd] leading-normal">
          Please check your mail!
        </p>

        {/* Login Button */}
        <Link href="/login">
          <div 
            className="absolute left-0 top-[327px] w-[385px] h-[75px] bg-[#ff4199] rounded-[12px] overflow-clip cursor-pointer hover:bg-[#e6398a] transition-colors"
            style={{ backdropFilter: 'blur(13.621px)' }}
            data-testid="button-login"
          >
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Ubuntu',Helvetica] font-medium text-[25.945px] text-center text-white leading-normal">
            login
          </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
