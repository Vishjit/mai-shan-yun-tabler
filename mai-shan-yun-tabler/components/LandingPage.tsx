  "use client";
  import { useRouter } from "next/navigation";

  export default function LandingPage() {
    const router = useRouter();

    return (
      <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
       
        {/* Click to get started*/}
        <button
          onClick={() => router.push("/dashboard")}
          aria-label="Get started"
          className="absolute left-1/2 bottom-[78px] transform -translate-x-1/2 bg-[#AF3939] text-white text-[17px] md:text-[18px] px-5 py-2 md:px-10 md:py-5 rounded-[22px] font-['Inter'] font-bold leading-[20px] shadow-md z-30 transition-colors duration-200 ease-in-out border-4 border-transparent hover:bg-white hover:text-[#AF3939] hover:border-[#AF3939]"
        >
          Click to get started
        </button>

        <div className="absolute left-[150px] top-[80px] flex justify-center items-center text-[#3D3D3D] text-[70px] font-['Jost'] font-bold leading-[32px] z-20">
          Mai Shan Yun Tabler
        </div>
        <div className="absolute left-[150px] top-[160px] flex justify-center items-center text-[#3D3D3D] text-[40px] font-['Jost'] font-normal leading-[32px] z-20">
          tagline
        </div>
         {/* logo */}
        <div className="absolute w-[85px] left-[40px] top-[55px] z-20">
          <img src="/logo.svg" alt="logo" className="w-full h-full object-contain" />
        </div>



        <div className="absolute left-[0%] bottom-0 w-full h-auto z-0 pointer-events-none">
          <img src="/mountain.svg" alt="mountain" className="w-[45%] h-auto" />
        </div>
        <div className="absolute w-[100%] h-[auto] left-[25%] bottom-0 ">
           <img src="/mountain 2.svg" alt="mountain" className="w-[60%] h-auto" />
          </div>
        <div className="absolute w-[75%] h-auto left-[62.5%] bottom-0">
          <img src="/mountain 3.svg" alt="mountain" className="w-[50%] h-auto" />
          </div>

        {/* Clouds*/}
        <img src="/cloud (4).svg" alt="cloud" className="absolute z-10 right-[2%] top-[80%] w-[15%] h-auto object-contain" />
        <img src="/cloud (1).svg" alt="cloud" className="absolute z-10 left-[45%] top-[30%] w-[10%] h-auto object-contain" />
        <img src="/cloud.svg" alt="cloud" className="absolute z-10 left-[2%] top-[50%] w-[15%] h-auto object-contain" />
        <img src="/cloud (6).svg" alt="cloud" className="absolute z-0 right-[20%] top-[40%] w-[200px] h-auto object-contain" />
        <img src="/cloud (5).svg" alt="cloud" className="absolute z-0 right-[88%] top-[35%] w-[100px] h-auto object-contain" />
        <img src="/cloud (2).svg" alt="cloud" className="absolute z-10 right-[3%] top-[5%] w-[250px] h-auto object-contain" />
        <img src="/cloud (3).svg" alt="cloud" className="absolute z-10 right-[55%] top-[70%] w-[100px] h-auto object-contain" />

        {/* Petals */}
        <img src="/petal.svg" alt="petal" className="absolute z-20 left-[35%] top-[58%] w-[36px] h-auto rotate-[-30deg]" />
        <img src="/petal.svg" alt="petal" className="absolute z-20 left-[75%] top-[90%] w-[40px] h-auto rotate-[10deg]" />
        <img src="/petals.svg" alt="petals" className="absolute z-20 left-[20%] top-[72%] w-[80px] h-auto opacity-90" />

      </div>
    );
  }
