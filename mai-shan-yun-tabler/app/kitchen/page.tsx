  "use client";
  import { useRouter } from "next/navigation";
  import Ticket from "../../components/ticket";
   import Menu from "../../components/menubutton";

  export default function Kitchen() {
    const router = useRouter();

    return (
      <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
        <div className="absolute left-[5%] top-[20%] w-full  flex z-20 pointer-events-none">
          <Menu />
        </div>

        <div className="absolute left-[-18] top-[38%] w-full  flex z-20 pointer-events-none">
          <img src="/pots.svg" alt="pots" className="w-[30%] h-auto z-20" />
        </div>
        <div className="absolute left-[75%] top-[50%] w-full  flex z-20 pointer-events-none">
          <img src="/vegetables.svg" alt="vegetables" className="w-[30%] h-auto z-20" />
        </div>

        <div className="absolute top-[50%] w-full  justify-center flex z-20 pointer-events-none">
          <img src="/bottomprinter.png" alt="printer" className="w-[25%] h-auto z-0" />
        </div>
        <div className="absolute top-[35%] w-full  justify-center flex z-20 pointer-events-none">
          <Ticket id={1} status={"available" as any} isSelected={false} onClick={() => {}} />
        </div>
        <div className="absolute top-[35%] w-full  justify-center flex z-20 pointer-events-none">
          <img src="/topprinter.svg" alt="printer" className="w-[25%] h-auto z-20" />
        </div>

        <div className="absolute bottom-0 w-full h-[30%] bg-[#AF3939] z-10" />
      </div>
    );
  }
