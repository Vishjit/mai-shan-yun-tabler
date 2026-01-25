  "use client";
  import { useRouter } from "next/navigation";

  export default function Analytics() {
    const router = useRouter();60

    return (
      <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
        <div className="absolute top-[10%] justify-center w-full text-[60px] font-['Jost'] font-bold flex pointer-events-none">
            Analytics
        </div>
        <div className="absolute top-[23%] justify-center w-full text-[30px] font-['Jost'] font-normal flex pointer-events-none">
            Order trends & popular items.
        </div>

         {/* Clouds*/}
        <img src="/cloud (8).svg" alt="cloud" className="absolute z-10 left-[20%] top-[25%] w-[7%] h-auto object-contain anim-cloud" />
        <img src="/cloud (3).svg" alt="cloud" className="absolute z-10 right-[7%] top-[10%] w-[180px] h-auto object-contain anim-cloud-long" />
       

       
      </div>
    );
  }
