"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import TableButton from "@/components/tablesbutton";
import MenuButton from "../../components/menubutton";
import Kitchenbutton from "@/components/kitchenbutton";

export default function Analytics() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "1y">("24h");

  const sampleMetrics: Record<string, any> = {
    "24h": {
      totalItems: 160,
      totalOrders: 46,
      totalSales: 531.03,
      popular: [
        { name: "House Ramen", qty: 34 },
        { name: "Spicy Cucumber Salad", qty: 12 },
        { name: "Steamed Pork Buns", qty: 10 },
      ],
    },
    "7d": {
      totalItems: 980,
      totalOrders: 210,
      totalSales: 3124.5,
      popular: [
        { name: "House Ramen", qty: 210 },
        { name: "Steamed Pork Buns", qty: 95 },
        { name: "Spicy Cucumber Salad", qty: 78 },
      ],
    },
    "30d": {
      totalItems: 4120,
      totalOrders: 920,
      totalSales: 14231.12,
      popular: [
        { name: "House Ramen", qty: 900 },
        { name: "Steamed Pork Buns", qty: 420 },
        { name: "Spicy Cucumber Salad", qty: 300 },
      ],
    },
    "1y": {
      totalItems: 49800,
      totalOrders: 11000,
      totalSales: 172312.5,
      popular: [
        { name: "House Ramen", qty: 9800 },
        { name: "Steamed Pork Buns", qty: 4200 },
        { name: "Spicy Cucumber Salad", qty: 3200 },
      ],
    },
  };

  const metrics = sampleMetrics[timeframe];

  return (
    <div className="relative w-full min-h-screen bg-[#FFFDFB] overflow-hidden">
       {/* Top buttons / nav */}
                          <div className="flex space-x-3 p-4 mb-6 items-center">
                            <div onClick={() => router.push("/menu")} className="cursor-pointer">
                              <MenuButton />
                            </div>
                            <div onClick={() => router.push("/tables")} className="cursor-pointer">
                              <TableButton />
                            </div>
                            <div onClick={() => router.push("/kitchen")} className="cursor-pointer">
                              <Kitchenbutton />
                            </div>
                          </div>

       {/* Clouds*/}
      <img src="/cloud (8).svg" alt="cloud" className="absolute z-10 left-[20%] top-[20%] w-[7%] h-auto object-contain anim-cloud" />
      <img src="/cloud (3).svg" alt="cloud" className="absolute z-10 right-[7%] top-[5%] w-[180px] h-auto object-contain anim-cloud-long" />

      <div className="absolute top-[8%] w-full text-center pointer-events-none">
        <div className="text-[60px] font-['Jost'] font-bold">Analytics</div>
        <div className="text-[30px] font-['Jost'] font-normal mt-2">Order trends & popular items.</div>
      </div>

      {/* Date selector and metrics */}
      <div className="absolute top-[35%] left-0 right-0 px-12 flex items-start justify-between">
        <div className="w-2/3 grid grid-cols-1 gap-6">
          <div className="flex items-center gap-8">
            <div className="text-lg font-bold">Total Items Ordered ({timeframe === '24h' ? 'past 24 hours' : timeframe === '7d' ? 'past 7 days' : timeframe === '30d' ? 'past 30 days' : 'past 1 year'}):</div>
            <div className="text-2xl font-normal">{metrics.totalItems}</div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-lg font-bold">Total Orders ({timeframe === '24h' ? 'past 24 hours' : timeframe === '7d' ? 'past 7 days' : timeframe === '30d' ? 'past 30 days' : 'past 1 year'}):</div>
            <div className="text-2xl font-normal">{metrics.totalOrders}</div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-lg font-bold">Total Sales ({timeframe === '24h' ? 'past 24 hours' : timeframe === '7d' ? 'past 7 days' : timeframe === '30d' ? 'past 30 days' : 'past 1 year'}):</div>
            <div className="text-2xl font-normal">${metrics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div>
            <div className="text-lg font-bold mb-2">Popular Items:</div>
            <ul className="space-y-2">
              {metrics.popular.map((p: any, idx: number) => (
                <li key={idx} className="flex justify-between w-2/3">
                  <span>{p.name}</span>
                  <span className="text-[#3D3D3D]">{p.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
          <div className="w-1/3 flex justify-end">
            <div className="relative">
              <label className="sr-only">Date Range</label>
              <div className="bg-[#efe7df] rounded-full px-5 py-2 flex items-center gap-3 shadow-sm">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="appearance-none bg-transparent border-none text-sm pr-8 focus:outline-none"
                >
                  <option value="24h">Past 24 hours</option>
                  <option value="7d">Past 7 days</option>
                  <option value="30d">Past 30 days</option>
                  <option value="1y">Past 1 year</option>
                </select>

                {/* custom dropdown icon (user-provided) */}
                <img src="/date dropdown.svg" alt="" className="w-5 h-5 pointer-events-none absolute right-4" />
              </div>
            </div>
          </div>
      </div>

  
    </div>
  );
}
