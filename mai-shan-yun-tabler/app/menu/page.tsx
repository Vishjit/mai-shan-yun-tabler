  "use client";
  import { useRouter } from "next/navigation";

  export default function Menu() {
    const router = useRouter();60

    return (
      <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
        <div className="absolute top-[10%] justify-center w-full text-[60px] font-['Jost'] font-bold flex pointer-events-none">
            Menu
        </div>

         {/* Clouds*/}
        <img src="/cloud (1).svg" alt="cloud" className="absolute z-10 left-[30%] top-[5%] w-[7%] h-auto object-contain anim-cloud" />
        <img src="/cloud (2).svg" alt="cloud" className="absolute z-10 right-[3%] top-[10%] w-[160px] h-auto object-contain anim-cloud-long" />
       

       
      </div>
    );
  }
