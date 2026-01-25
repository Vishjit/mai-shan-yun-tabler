"use client";

import React, { useState, useEffect } from "react";

interface SavedLayout {
  id: number;
  name?: string;
  thumbnail?: string;
  snapshot?: any[];
  groups: Array<{ tableId: number; items: Array<{ id: number; type: string }> }>;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (type: string) => void;
  onSaveLayout: () => void;
  savedLayouts?: SavedLayout[];
  onLoadLayout?: (id: number) => void;
  onDuplicateLayout?: (id: number) => void;
  onDeleteLayout?: (id: number) => void;
}

export default function Sidebar({ isOpen, onClose, onAddItem, onSaveLayout, savedLayouts = [], onLoadLayout, onDuplicateLayout, onDeleteLayout }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"layout" | "orders">("layout");
  const [generatedThumbs, setGeneratedThumbs] = useState<Record<number, string>>({});

  useEffect(() => {
    let mounted = true;
    const pad = 8;
    const targetW = 120;
    const targetH = 80;

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const genAll = async () => {
      const map: Record<number, string> = {};
      for (const sl of savedLayouts) {
        try {
          if (!sl.snapshot || !sl.snapshot.length) continue;
          const items = sl.snapshot as any[];
          const xs = items.map((i) => i.x);
          const ys = items.map((i) => i.y);
          const minX = Math.min(...xs);
          const minY = Math.min(...ys);
          const maxX = Math.max(...xs);
          const maxY = Math.max(...ys);
          const bw = Math.max(16, maxX - minX + pad * 2);
          const bh = Math.max(16, maxY - minY + pad * 2);
          const scale = Math.min(targetW / bw, targetH / bh);

          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          ctx.fillStyle = "#FFFDFB";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const assetPathFor = (s: any) => {
            if (s.type === "table") return "/table.svg";
            if (s.type === "marker") return "/marker.svg";
            return `/${(s.itemType || "right chair").replace(/-/g, " ")}.svg`;
          };

          // preload unique images
          const unique = Array.from(new Set(items.map((it) => assetPathFor(it))));
          const imgMap: Record<string, HTMLImageElement | null> = {};
          await Promise.all(
            unique.map(async (p) => {
              imgMap[p] = await loadImage(p);
            })
          );

          const toX = (x: number) => Math.round((x - minX + pad) * scale);
          const toY = (y: number) => Math.round((y - minY + pad) * scale);

          for (const s of items) {
            const path = assetPathFor(s);
            const img = imgMap[path];
            if (s.type === "table") {
              const w = Math.max(8, Math.round(120 * scale));
              const h = Math.max(8, Math.round(120 * scale));
              const dx = toX(s.x) - Math.round(w / 2);
              const dy = toY(s.y) - Math.round(h / 2);
              if (img) ctx.drawImage(img, dx, dy, w, h);
              else {
                ctx.fillStyle = "#57321F";
                ctx.fillRect(dx, dy, w, h);
              }
              continue;
            }
            if (s.type === "marker") {
              const r = Math.max(2, Math.round(12 * scale));
              const cx = toX(s.x);
              const cy = toY(s.y);
              const w = r * 2;
              const h = r * 2;
              const dx = cx - Math.round(w / 2);
              const dy = cy - Math.round(h / 2);
              if (img) ctx.drawImage(img, dx, dy, w, h);
              else {
                ctx.fillStyle = "#AF3939";
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
              }
              continue;
            }

            const w = Math.max(6, Math.round(112 * scale));
            const h = Math.max(6, Math.round(112 * scale));
            const dx = toX(s.x) - Math.round(w / 2);
            const dy = toY(s.y) - Math.round(h / 2);
            if (img) ctx.drawImage(img, dx, dy, w, h);
            else {
              ctx.fillStyle = "#3D3D3D";
              ctx.fillRect(dx, dy, w, h);
            }
          }

          map[sl.id] = canvas.toDataURL("image/png");
        } catch (e) {
          // ignore single layout failure
        }
      }
      if (mounted) setGeneratedThumbs(map);
    };

    genAll();
    return () => {
      mounted = false;
    };
  }, [savedLayouts]);

  return (
    <aside
      className={`fixed right-0 top-0 bottom-0 h-full bg-[#F0E7DF] shadow-xl w-[320px]
      transition-transform duration-300 flex flex-col border-l-8 border-[#57321F]
      ${isOpen ? "translate-x-0" : "translate-x-full"} z-40`}
    >
      <div className="p-4 flex flex-col flex-1 overflow-y-auto">

        {/* Tabs */}
        <div className="mb-6">
          <div className="relative bg-white rounded-full p-0.5">
            <div
              aria-hidden
              className="absolute top-0 left-0 h-full w-1/2 bg-[#AF3939] rounded-full transition-transform duration-300"
              style={{
                transform: `translateX(${activeTab === "layout" ? 0 : 100}%)`,
              }}
            />
            <div className="relative z-10 grid grid-cols-2">
              <button
                onClick={() => setActiveTab("layout")}
                className={`py-2 text-sm font-['Jost'] ${
                  activeTab === "layout" ? "text-white" : "text-gray-700"
                }`}
              >
                Table Layout
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-2 text-sm font-['Jost'] ${
                  activeTab === "orders" ? "text-white" : "text-gray-700"
                }`}
              >
                Table Orders
              </button>
            </div>
          </div>
        </div>

        {/* ================= LAYOUT TAB ================= */}
        {activeTab === "layout" && (
          <>
            <h3 className="text-xl font-bold mb-3 font-['Jost']">
              Saved Layouts:
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {savedLayouts.length === 0 ? (
                <>
                  <div className="bg-[#FFFDFB] rounded-2xlflex items-center justify-center">
                    <div className="w-32 h-20 " />
                  </div>
                  <div className="bg-[#FFFDFB] rounded-2xl flex items-center justify-center">
                    <div className="w-32 h-20 " />
                  </div>
                  <div className="bg-[#FFFDFB] rounded-2xl flex items-center justify-center">
                    <div className="w-32 h-20 " />
                  </div>
                </>
              ) : (
                savedLayouts.map((sl, idx) => (
                  <div key={`saved-${sl.id}-${idx}`} className="group relative bg-[#FFFDFB] rounded-2xl p-1 flex items-center justify-center">
                    <div className="absolute top-[-15px] right-[-10] flex  z-20 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateLayout && onDuplicateLayout(sl.id);
                        }}
                        className="w-20 h-10 flex items-center justify-center"
                        aria-label={`Duplicate ${sl.name ?? `Layout ${sl.id}`}`}
                      >
                        <img src="/copy button.svg" alt="duplicate" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLayout && onDeleteLayout(sl.id);
                        }}
                        className="w-10 h-10 flex items-center justify-center"
                        aria-label={`Delete ${sl.name ?? `Layout ${sl.id}`}`}
                      >
                        <img src="/trash button.svg" alt="delete" className="w-4 h-4" />
                      </button>
                    </div>

                    { (generatedThumbs[sl.id] || sl.thumbnail) ? (
                      <img
                        src={generatedThumbs[sl.id] || sl.thumbnail}
                        alt={sl.name}
                        className="w-28 h-20 object-cover rounded-md cursor-pointer"
                        onClick={() => onLoadLayout && onLoadLayout(sl.id)}
                      />
                    ) : (
                      <div className="text-sm text-gray-700 text-center">
                        <div className="font-semibold">{sl.name ?? `Layout ${sl.id}`}</div>
                        <div className="text-xs">{sl.groups.length} groups</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="w-full bg-white rounded-full h-3 mb-3">
              <div className="bg-[#AF3939] h-3 rounded-full w-[18%]" />
            </div>

            <p className="text-sm text-[#696159] mb-6">
              Click item to add to restaurant floor.
            </p>

            {/* Items grid */}
            <div className="grid grid-cols-2 gap-4">

              {/* Table */}
              <div className="flex flex-col items-start cursor-pointer" onClick={() => onAddItem("table")}>
                <div className="bg-[#FFFDFB] rounded-2xl p-3 w-28 h-28 flex items-center justify-center">
                  <img
                    src="/table panel.svg"
                    alt="table"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-2 text-center w-28">Table</div>
              </div>

      {/* Marker */}
              <div className="flex flex-col items-start cursor-pointer" onClick={() => onAddItem("marker")}>
                <div className="bg-[#FFFDFB] rounded-2xl p-3 w-28 h-28 flex items-center justify-center">
                  <img
                    src="/marker.svg"
                    alt="marker"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-2 text-center w-28">Marker</div>
              </div>
              {[
                ["right chair.svg", "right-chair"],
                ["left chair.svg", "left-chair"],
                ["top chair.svg", "top-chair"],
                ["bottom chair.svg", "bottom-chair"],
                ["top couch.svg", "top-couch"],
                ["bottom couch.svg", "bottom-couch"],
              ].map(([src, type]) => (
                <div key={type as string} className="flex flex-col items-start cursor-pointer" onClick={() => onAddItem(type as string)}>
                  <div className="bg-[#FFFDFB] rounded-2xl p-3 w-28 h-28 flex items-center justify-center">
                    <img src={`/${src}`} alt={type as string} className="w-full h-full object-contain" />
                  </div>
                  <div className="mt-2 text-center w-28">{(type as string).replace(/-/g, ' ')}</div>
                </div>
              ))}

              {/* Save Layout */}
              <div className="flex flex-col items-start cursor-pointer" onClick={onSaveLayout}>
                <div className="bg-[#AF3939] rounded-2xl p-3 w-28 h-28 flex items-center justify-center">
                  <img src="/save layout.svg" alt="save layout" className="w-full h-full object-contain" />
                </div>
                <div className="mt-2 text-center w-28 text-[#3D3D3D]">Save Layout</div>
              </div>
            </div>
          </>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === "orders" && (
          <div className="text-sm text-gray-600">
            Orders view coming from shared state.
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 bg-[#AF3939] text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </aside>
  );
}
