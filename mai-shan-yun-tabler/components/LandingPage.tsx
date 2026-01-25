"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
      {/* Example divs from Figma */}
      <div className="absolute w-[240px] h-[45px] left-[1592px] top-[384px] bg-[#F0E7DF]" />
      <div className="absolute w-[218px] h-[118px] left-[795px] top-[670px] outline-[10px] outline-[#57321F] outline-offset-[-5px]" />
      <div className="absolute w-[218px] h-[118px] left-[1050px] top-[443px] rotate-180 origin-top-left outline-[9px] outline-[#57321F] outline-offset-[-4.5px]" />
      <div className="absolute w-[624px] h-[516px] left-[133px] top-[193px] bg-gradient-to-br from-[#FFF7EC] to-[#DCD3C8] border-[10px] border-[#57321F]" />
      <div className="absolute w-[493px] h-[493px] left-[1378px] top-[889px] rotate-180 origin-top-left bg-gradient-to-br from-[#FFF7EC] to-[#DCD3C8] border-[10px] border-[#57321F]" />
      <div className="absolute w-[423px] h-[80px] left-[641px] top-[898px] bg-[#AF3939] rounded-[30px]" />

      {/* Click to get started button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute left-[684px] top-[922px] flex justify-center items-center text-[#FFFDFB] text-[36px] font-['Inter'] font-bold leading-[32px] cursor-pointer"
      >
        Click to get started
      </button>

      <div className="absolute w-[423px] h-[80px] left-[637px] top-[995px] bg-[#FFFDFB] rounded-[30px]" />
      <div className="absolute left-[680px] top-[1019px] flex justify-center items-center text-[#AF3939] text-[36px] font-['Inter'] font-bold leading-[32px]">
        Click to get started
      </div>

      <div className="absolute w-[511.14px] h-[668.5px] left-[1300.86px] top-[160px] bg-gradient-to-br from-[#FFF7EC] to-[#DCD3C8] border-[10px] border-[#57321F]" />
      <div className="absolute w-[314px] h-[192px] left-[1303px] top-[55px] bg-white outline-[11px] outline-[#57321F] outline-offset-[-5.5px]" />
      <div className="absolute w-[314px] h-[192px] left-[1700px] top-[1109px] rotate-180 origin-top-left bg-[#FFFDFB] outline-[11px] outline-[#57321F] outline-offset-[-5.5px]" />
      <div className="absolute w-[270px] h-[146px] left-[369px] top-[670px] rotate-180 origin-top-left bg-[#FFFDFB] outline-[10px] outline-[#57321F] outline-offset-[-5px]" />

      <div className="absolute left-[189px] top-[115px] flex justify-center items-center text-[#3D3D3D] text-[80px] font-['Jost'] font-bold leading-[32px]">
        Mai Shan Yun Title
      </div>
      <div className="absolute left-[189px] top-[198px] flex justify-center items-center text-[#3D3D3D] text-[48px] font-['Jost'] font-normal leading-[32px]">
        tagline
      </div>

      <div className="absolute w-[71px] h-[35.4px] left-[724px] top-[524px] bg-gradient-to-br from-[#F8E1D6] to-[#E8B7AC]" />
      <div className="absolute w-[150px] h-[28.17px] left-[78px] top-[370px] bg-[#F0E7DF]" />
      <div className="absolute w-[240px] h-[45px] left-[1116px] top-[468px] bg-[#F0E7DF]" />

      <div className="absolute w-[71px] h-[35.4px] left-[315.44px] top-[875px] rotate-[41deg] origin-top-left bg-gradient-to-br from-[#F8E1D6] to-[#E8B7AC]" />
      <div className="absolute w-[71px] h-[35.4px] left-[298.73px] top-[871.78px] rotate-[11deg] origin-top-left bg-gradient-to-br from-[#F8E1D6] to-[#E8B7AC]" />
      <div className="absolute w-[71px] h-[35.4px] left-[1232.94px] top-[1003.64px] rotate-[26deg] origin-top-left bg-gradient-to-br from-[#F8E1D6] to-[#E8B7AC]" />

      <div className="absolute w-[113px] h-[113px] left-[40px] top-[76px] bg-[#AF3939] rounded-full" />
      <div className="absolute w-[50px] h-[49px] left-[92px] top-[118px]">
        <div className="absolute w-[45.78px] h-[45.94px] left-[2.08px] top-[2.04px] bg-white border-[0.5px] border-[#FFF7EC]" />
      </div>
      <div className="absolute w-[89px] h-[89px] left-[52px] top-[88px]">
        <div className="absolute w-[60.57px] h-[59.33px] left-[11.12px] top-[14.83px] outline-[6px] outline-[#FFF7EC] outline-offset-[-3px]" />
      </div>
    </div>
  );
}
