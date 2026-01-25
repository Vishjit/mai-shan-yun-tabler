    "use client";
    import { useRouter } from "next/navigation";
    import Ticket from "../../components/ticket";
    import Menu from "../../components/menubutton";

    export default function Kitchen() {
      const router = useRouter();

      return (
        <div className="relative w-full h-screen bg-[#FFFDFB] overflow-hidden">
          <div className="absolute left-[2%] top-[5%] w-full  flex z-20">
            <Menu />
          </div>

        <div style={{ position: "absolute", top: 0, right: 120, display: "flex", gap:120, zIndex: 20 }}>
                    <div style={{ width: 110 }}>
                      <Ticket
                        tableNumber={4}
                        orderNo={201}
                        items={[{ name: "Steamed Pork Buns", quantity: 1 }]}
                        printing={false}
                      />
                    </div>
        
                    <div style={{ width: 110 }}>
                      <Ticket
                        tableNumber={3}
                        orderNo={198}
                        items={[{ name: "House Ramen", quantity: 3 }]}
                        printing={false}
                      />
                    </div>
        
                    <div style={{ width: 110 }}>
                      <Ticket
                        tableNumber={1}
                        orderNo={127}
                        items={[{ name: "Table 2 - Spicy Cucumber Salad", quantity: 1 }]}
                        printing={false}
                      />
                    </div>
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
          <div className="absolute top-[50%] w-full  justify-center flex z-20 pointer-events-none">
            <Ticket
              tableNumber={2}
              orderNo={127}
              items={[{ name: "Spicy Cucumber Salad", quantity: 1, notes: "No tomatoes" }]}
              printing={true}
            />
          </div>
          <div className="absolute top-[35%] w-full  justify-center flex z-20 pointer-events-none">
            <img src="/topprinter.svg" alt="printer" className="w-[25%] h-auto z-20" />
          </div>

          <div className="absolute bottom-0 w-full h-[30%] bg-[#AF3939] z-10" />
        </div>
      );
    }
