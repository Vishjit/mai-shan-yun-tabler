"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TableCard from "./TableCard";
import Marker from "./marker";
import { TableStatus } from "../lib/data";
import Sidebar from "./sidebar";
import Menu from "./menubutton";
import Kitchen from "./kitchenbutton";
import Analytics from "./analyticsbutton";
import { useTickets } from "../context/ticketContext";
import { menuItems } from "../lib/menu";
import MenuItem from "./MenuItem";
import Image from "next/image";

interface MenuItemType {
  id: number;
  name: string;
  price: number;
  ingredients: string;
}

interface SavedLayout {
  id: number;
  name: string;
  thumbnail?: string;
  snapshot?: Array<{ id: number; type: "table" | "marker" | "item" | "group"; itemType?: string; x: number; y: number }>;
  groups: Array<{ tableId: number; items: Array<{ id: number; type: string }> }>;
}

function MenuOverlay({ ticketId, onClose }: { ticketId: number; onClose: () => void }) {
  const { addItemToTicket, removeItemFromTicket, getTicketById } = useTickets();

  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [quantity, setQuantity] = useState(1);

  const ticket = getTicketById(ticketId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full h-full bg-[#FFFDFB] overflow-auto">
        
        {/* Back Button (sticky so it's visible while scrolling) */}
        <button
          onClick={onClose}
          className="sticky top-4 left-4 w-10 h-10 rounded-full bg-[#AF3939] text-white flex items-center justify-center text-xl font-bold z-50"
          style={{ position: '-webkit-sticky' as any }}
        >
          ←
        </button>

        {/* Title */}
        <div className="absolute top-[10%] justify-center w-full text-[60px] font-['Jost'] font-bold flex pointer-events-none">
          Menu
        </div>

        {/* Clouds */}
        <Image
          src="/cloud (1).svg"
          alt="cloud"
          width={100}
          height={100}
          className="absolute z-10 left-[30%] top-[5%] w-[7%] h-auto object-contain anim-cloud"
        />
        <Image
          src="/cloud (2).svg"
          alt="cloud"
          width={160}
          height={100}
          className="absolute z-10 right-[3%] top-[10%] w-[160px] h-auto object-contain anim-cloud-long"
        />

        {/* MENU ITEMS - GROUPED BY CATEGORY */}
        <div className="mt-56 px-16">
          {(() => {
            const categoryOrder = [
              "Lunch Special",
              "Special Offer",
              "Appetizer",
              "Rice Noodle",
              "Tossed Rice Noodle",
              "Ramen",
              "Tossed Ramen",
              "Fried Chicken",
              "Fried Rice",
              "Wonton",
              "Drink",
              "Additonal",
              "Mai Dessert",
              "Milk Tea",
              "Jas-Lemonade",
              "Fruit Tea",
              "Allergies & Restrictions",
            ];

            const getCategoryFor = (m: any) => {
              if (m.category) return m.category;
              if (m.description === "Special Diet" || m.description === "Allergies & Restrictions") return "Allergies & Restrictions";
              return "Uncategorized";
            };

            const allCategories = Array.from(new Set(menuItems.map((m) => getCategoryFor(m))));
            const extras = allCategories.filter((c) => !categoryOrder.includes(c));
            const ordered = [...categoryOrder, ...extras];

            return ordered.map((category) => {
              const items = menuItems.filter((m) => getCategoryFor(m) === category);
              return (
                <section key={category} className="mb-10">
                  <div className="flex items-center justify-start gap-4 mb-4">
                    <h2 className="text-3xl font-bold mb-0 text-[#3D3D3D]">{category}</h2>
                    <span className="text-[#696159]">({items.length})</span>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <MenuItem
                          key={item.id}
                          name={item.name}
                          price={item.price}
                          ingredients={item.ingredients}
                          onClick={() => {
                            setSelectedItem(item as any);
                            const existingItem = ticket?.items.find(i => i.id === item.id.toString());
                            setQuantity(existingItem ? existingItem.quantity : 1);
                          }}
                        />
                      ))
                    ) : (
                      <div className="col-span-4 text-[#696159] italic">No items in this category.</div>
                    )}
                  </div>
                </section>
              );
            });
          })()}
        </div>

        {selectedItem && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-8 py-4 flex items-center gap-6 z-50">
            <span className="font-semibold text-lg">{selectedItem.name}</span>

            <div className="flex items-center gap-3">
              <button
              onClick={() => setQuantity(q => Math.max(0, q - 1))}
              >
                −
              </button>

              <span className="w-6 text-center text-lg">{quantity}</span>

              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 rounded-full bg-gray-200 text-xl font-bold"
              >
                +
              </button>
            </div>

            <button
                onClick={() => {
                if (selectedItem) {
                  if (quantity > 0) {
                    // This update originates from the tables sidebar -> request kitchen print
                    addItemToTicket(ticketId, { id: selectedItem.id.toString(), name: selectedItem.name, price: selectedItem.price, quantity }, true);
                  } else {
                    removeItemFromTicket(ticketId, selectedItem.id.toString(), true);
                  }
                  setSelectedItem(null);
                  setQuantity(1);
                }
              }}
              className="bg-[#AF3939] text-white px-4 py-2 rounded-lg"
            >
              {quantity > 0 ? 'Update Order' : 'Remove Item'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TableGrid() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuTicketId, setMenuTicketId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const router = useRouter();
  const { createTicket } = useTickets();

  // Table/marker data
  const [tableData, setTableData] = useState<
    {
      id: number;
      status: TableStatus;
      type: "table" | "marker" | "item" | "group";
      itemType?: string;
      x: number;
      y: number;
      markerNumber?: number;
      parentId?: number | null;
      groupId?: number | null;
      width?: number;
      height?: number;
      variant?: string;
    }[]
  >([
    { id: 1, status: "available", type: "table", x: 120, y: 80 },
    { id: 2, status: "ordering", type: "table", x: 360, y: 80 },
    { id: 3, status: "alert", type: "table", x: 120, y: 320 },
    // Each table comes with one marker — start them RED
    { id: 4, status: "alert", type: "marker", markerNumber: 1, x: 160, y: 120 },
    { id: 5, status: "alert", type: "marker", markerNumber: 2, x: 400, y: 120 },
    { id: 6, status: "alert", type: "marker", markerNumber: 3, x: 160, y: 360 },
  ]);

  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [movingGroupId, setMovingGroupId] = useState<number | null>(null);
  const [isolatedItemId, setIsolatedItemId] = useState<number | null>(null);
  const [pressedItemId, setPressedItemId] = useState<number | null>(null);
  const movingGroupRef = useRef<number | null>(null);

  // Create tickets for existing markers on mount
  useEffect(() => {
    tableData.filter(item => item.type === "marker").forEach(marker => {
      createTicket(marker.markerNumber || 0, marker.id);
    });
  }, [createTicket, tableData]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const movingIdRef = useRef<number | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);

  // Clicking a table/marker
  const handleTableClick = (id: number) => {
    setSelectedTable(id);
    setSidebarOpen(true);
  };

  // Toggle move mode
  const handleMoveToggle = (id: number) => {
    setMovingId((prev) => (prev === id ? null : id));
  };

  // Dragging logic
  const handleCardMouseDown = (e: React.MouseEvent, id: number) => {
    if (movingId !== id) return;
    e.preventDefault();
    movingIdRef.current = id;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cardHalf = 96; // Half of w-48 (192px)

    const originals = tableData
      .filter((t) => t.id === id || t.parentId === id)
      .map((t) => ({ id: t.id, x: t.x, y: t.y }));

    const origMain = originals.find((o) => o.id === id);

    const onMouseMove = (ev: MouseEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = ev.clientX - r.left - cardHalf;
      const y = ev.clientY - r.top - cardHalf;

      setTableData((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            return { ...t, x: Math.max(0, x), y: Math.max(0, y) };
          }
          // move children that have parentId === id together
          if (t.parentId === id) {
            const orig = originals.find((o) => o.id === t.id);
            if (!orig || !origMain) return t;
            const dx = x - origMain.x;
            const dy = y - origMain.y;
            return { ...t, x: Math.max(0, orig.x + dx), y: Math.max(0, orig.y + dy) };
          }
          return t;
        })
      );
    };

    const onMouseUp = () => {
      movingIdRef.current = null;
      setMovingId(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      const snap = (v: number) => Math.round(v / 16) * 16;

      setTableData((prev) =>
        prev.map((t) => {
          if (t.id === id || t.parentId === id) {
            return { ...t, x: snap(t.x), y: snap(t.y) };
          }
          return t;
        })
      );

      // after moving, update grouping for this item
      setTableData((prev) => {
        const moved = prev.find((p) => p.id === id);
        if (!moved) return prev;
        return prev.map((p) => {
          if (p.id === id) {
            // determine nearest table within threshold
            const nearestTable = prev
              .filter((q) => q.type === "table")
              .map((t) => ({ t, dist: Math.hypot(t.x - (moved.x ?? 0), t.y - (moved.y ?? 0)) }))
              .sort((a, b) => a.dist - b.dist)[0];
            if (nearestTable && nearestTable.dist < 120) {
              return { ...p, parentId: nearestTable.t.id };
            }
            return { ...p, parentId: null };
          }
          return p;
        });
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Add a new item (table, marker, or chair/couch)
  const handleAddItem = (type: string, variant?: string) => {
    const newId = tableData.length ? Math.max(...tableData.map((t) => t.id)) + 1 : 1;

    let newItem: any;
    if (type === "marker") {
      const nextMarkerNumber =
        Math.max(0, ...tableData.filter((t) => t.type === "marker").map((m) => m.markerNumber || 0)) + 1;

      newItem = {
        id: newId,
        status: "available" as TableStatus,
        type: "marker" as const,
        markerNumber: nextMarkerNumber,
        x: 200,
        y: 200,
        parentId: null,
      };
      createTicket(nextMarkerNumber, newId);
    } else if (type === "table") {
      newItem = {
        id: newId,
        status: "available" as TableStatus,
        type: "table" as const,
        x: 200,
        y: 200,
        parentId: null,
        variant: variant, // optional image variant for table (e.g., 'couch-table.png')
      } as any;
    } else {
      // generic item (chair/couch)
      newItem = {
        id: newId,
        status: "available" as TableStatus,
        type: "item" as const,
        itemType: type,
        x: 220,
        y: 220,
        parentId: null,
      };
    }

    // find nearest table
    const nearestTable = tableData
      .filter((t) => t.type === "table")
      .map((t) => ({ t, dist: Math.hypot(t.x - newItem.x, t.y - newItem.y) }))
      .sort((a, b) => a.dist - b.dist)[0];
    if (nearestTable && nearestTable.dist < 120) {
      newItem.parentId = nearestTable.t.id;
    }

    setTableData((prev) => [...prev, newItem]);
    setSelectedTable(newId);
    setSidebarOpen(true);
  };

  // Status sequence
  const statusSequence: TableStatus[] = ["alert", "ordering", "available"];

  // Forward status: RED -> YELLOW -> GREEN
  const handleMarkerForward = (id: number) => {
    setTableData((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.type !== "marker") return item;
        const currentIndex = statusSequence.indexOf(item.status);
        const nextIndex = (currentIndex + 1) % statusSequence.length;
        return { ...item, status: statusSequence[nextIndex] };
      })
    );
  };

  // Backward status: GREEN -> YELLOW -> RED
  const handleMarkerBackward = (id: number) => {
    setTableData((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.type !== "marker") return item;
        const currentIndex = statusSequence.indexOf(item.status);
        const prevIndex = (currentIndex - 1 + statusSequence.length) % statusSequence.length;
        return { ...item, status: statusSequence[prevIndex] };
      })
    );
  };

  const handleGroupMouseDown = (e: React.MouseEvent, groupContainerId: number, groupId: number) => {
    e.preventDefault();
    e.stopPropagation();
    movingGroupRef.current = groupId;
    setMovingGroupId(groupId);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const originals = tableData
      .filter((t) => (t as any).groupId === groupId)
      .map((t) => ({ id: t.id, x: t.x, y: t.y }));

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setTableData((prev) =>
        prev.map((p) => {
          if ((p as any).groupId === groupId) {
            const orig = originals.find((o) => o.id === p.id);
            if (!orig) return p;
            return { ...p, x: Math.max(0, orig.x + dx), y: Math.max(0, orig.y + dy) };
          }
          return p;
        })
      );
    };

    const onMouseUp = () => {
      movingGroupRef.current = null;
      setMovingGroupId(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      setTableData((prev) =>
        prev.map((p) => {
          if ((p as any).groupId === groupId) {
            const snap = (v: number) => Math.round(v / 16) * 16;
            return { ...p, x: snap(p.x), y: snap(p.y) };
          }
          return p;
        })
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleSaveLayout = async () => {
    const groups = tableData
      .filter((t) => t.type === "table")
      .map((table) => ({
        tableId: table.id,
        items: tableData
          .filter((it) => it.parentId === table.id)
          .map((it) => ({ id: it.id, type: it.type === 'item' ? (it.itemType ?? 'item') : it.type })),
      }));

    const itemsToInclude = tableData.filter((t) => t.type === "table" || t.type === "item" || t.type === "marker");

    if (itemsToInclude.length === 0) {
      return;
    }

    const pad = 8;
    const thumbW = 240;
    const thumbH = 160;

    const xs = itemsToInclude.map((i) => i.x);
    const ys = itemsToInclude.map((i) => i.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    try {
      if (containerRef.current) {
        const html2canvas = (await import("html2canvas")).default;
        const zoom = 1.15;
        const scale = window.devicePixelRatio * zoom;
        const sourceCanvas = await html2canvas(containerRef.current as HTMLElement, { backgroundColor: null, scale });

        const sx = Math.max(0, Math.floor(minX * scale - pad * scale));
        const sy = Math.max(0, Math.floor(minY * scale - pad * scale));
        const sw = Math.min(sourceCanvas.width - sx, Math.ceil((maxX - minX + pad * 2) * scale));
        const sh = Math.min(sourceCanvas.height - sy, Math.ceil((maxY - minY + pad * 2) * scale));

        const thumbCanvas = document.createElement("canvas");
        thumbCanvas.width = thumbW;
        thumbCanvas.height = thumbH;
        const tctx = thumbCanvas.getContext("2d");
        if (tctx) {
          tctx.fillStyle = "#FFFDFB";
          tctx.fillRect(0, 0, thumbW, thumbH);
          tctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, thumbW, thumbH);
        }

        const thumbnail = thumbCanvas.toDataURL("image/png");
        const snapshot = itemsToInclude.map((t) => ({ id: t.id, type: t.type, itemType: t.itemType, x: t.x - minX, y: t.y - minY }));
        const id = savedLayouts.length ? Math.max(...savedLayouts.map((s) => s.id)) + 1 : 1;
        setSavedLayouts((prev) => [...prev, { id, name: `Layout ${id}`, groups, snapshot, thumbnail }]);
        return;
      }
    } catch (e) {
      // fall through to canvas rendering
    }

    try {
      const bboxW = Math.max(16, maxX - minX + pad * 2);
      const bboxH = Math.max(16, maxY - minY + pad * 2);
      const scaleCanvas = Math.max(0.01, Math.min(1, Math.min(thumbW / bboxW, thumbH / bboxH)));

      const baseTableW = 120;
      const baseTableH = 120;
      const baseItemW = 112;
      const baseItemH = 112;
      const baseMarker = 12;

      const assetPathFor = (s: any) => {
        if (s.type === "table") return "/table.svg";
        if (s.type === "marker") return "/marker.svg";
        return `/${(s.itemType || "right chair").replace(/-/g, " ")}.svg`;
      };

      const uniquePaths = Array.from(new Set(itemsToInclude.map((s) => assetPathFor(s))));
      const imgMap: Record<string, HTMLImageElement | null> = {};
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          const img = document.createElement("img") as HTMLImageElement;
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

      await Promise.all(
        uniquePaths.map(async (p) => {
          try {
            imgMap[p] = await loadImage(p);
          } catch (e) {
            imgMap[p] = null;
          }
        })
      );

      const thumbCanvas = document.createElement("canvas");
      thumbCanvas.width = thumbW;
      thumbCanvas.height = thumbH;
      const tctx = thumbCanvas.getContext("2d");
      if (tctx) {
        tctx.fillStyle = "#FFFDFB";
        tctx.fillRect(0, 0, thumbW, thumbH);

        const toX = (x: number) => Math.round((x - minX + pad) * scaleCanvas);
        const toY = (y: number) => Math.round((y - minY + pad) * scaleCanvas);

        for (const s of itemsToInclude) {
          const path = assetPathFor(s);
          const img = imgMap[path];
          if (s.type === "table") {
            const w = Math.max(8, Math.round(baseTableW * scaleCanvas));
            const h = Math.max(8, Math.round(baseTableH * scaleCanvas));
            const dx = toX(s.x) - Math.round(w / 2);
            const dy = toY(s.y) - Math.round(h / 2);
            if (img) tctx.drawImage(img, dx, dy, w, h);
            else {
              tctx.fillStyle = "#57321F";
              tctx.fillRect(dx, dy, w, h);
            }
            continue;
          }
          if (s.type === "marker") {
            const r = Math.max(2, Math.round(baseMarker * scaleCanvas));
            const cx = toX(s.x);
            const cy = toY(s.y);
            const w = r * 2;
            const h = r * 2;
            const dx = cx - Math.round(w / 2);
            const dy = cy - Math.round(h / 2);
            if (img) tctx.drawImage(img, dx, dy, w, h);
            else {
              tctx.fillStyle = "#AF3939";
              tctx.beginPath();
              tctx.arc(cx, cy, r, 0, Math.PI * 2);
              tctx.fill();
            }
            continue;
          }

          const w = Math.max(6, Math.round(baseItemW * scaleCanvas));
          const h = Math.max(6, Math.round(baseItemH * scaleCanvas));
          const dx = toX(s.x) - Math.round(w / 2);
          const dy = toY(s.y) - Math.round(h / 2);
          if (img) tctx.drawImage(img, dx, dy, w, h);
          else {
            tctx.fillStyle = "#3D3D3D";
            tctx.fillRect(dx, dy, w, h);
          }
        }
      }

      if (tctx) {
        const thumbnail = thumbCanvas.toDataURL("image/png");
        const snapshot = itemsToInclude.map((t) => ({ id: t.id, type: t.type, itemType: t.itemType, x: t.x - minX, y: t.y - minY }));
        const id = savedLayouts.length ? Math.max(...savedLayouts.map((s) => s.id)) + 1 : 1;
        setSavedLayouts((prev) => [...prev, { id, name: `Layout ${id}`, groups, snapshot, thumbnail }]);
        return;
      }
    } catch (e) {
      // ignore
    }
  };

  const handleLoadLayout = (id: number) => {
    const saved = savedLayouts.find((s) => s.id === id);
    if (!saved || !saved.snapshot) return;

    const loaded = saved.snapshot.map((s: any, idx: number) => {
      if (s.type === "table") return { id: s.id, status: "available" as TableStatus, type: "table" as const, x: s.x, y: s.y, parentId: null };
      if (s.type === "marker") return { id: s.id, status: "available" as TableStatus, type: "marker" as const, markerNumber: (s.markerNumber ?? idx + 1), x: s.x, y: s.y, parentId: null };
      return { id: s.id, status: "available" as TableStatus, type: "item" as const, itemType: s.itemType, x: s.x, y: s.y, parentId: null };
    });

    setTableData(loaded);
    setSidebarOpen(false);
    setSelectedTable(null);

    setTimeout(() => {
      setTableData((prev) =>
        prev.map((p) => {
          if (p.type === "item" || p.type === "marker") {
            const nearest = prev
              .filter((t) => t.type === "table")
              .map((t) => ({ t, dist: Math.hypot(t.x - p.x, t.y - p.y) }))
              .sort((a, b) => a.dist - b.dist)[0];
            if (nearest && nearest.dist < 120) return { ...p, parentId: nearest.t.id };
            return { ...p, parentId: null };
          }
          return { ...p, parentId: null };
        })
      );
    }, 20);
  };

  const handleDeleteLayout = (id: number) => {
    setSavedLayouts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDuplicateLayout = (id: number) => {
    const saved = savedLayouts.find((s) => s.id === id);
    if (!saved || !saved.snapshot) return;

    const nextIdBase = tableData.length ? Math.max(...tableData.map((t) => t.id)) + 1 : 1;
    let nextId = nextIdBase;
    const oldToNew: Record<number, number> = {};
    saved.snapshot.forEach((s: any) => {
      oldToNew[s.id] = nextId++;
    });

    const xs = saved.snapshot.map((s: any) => s.x);
    const ys = saved.snapshot.map((s: any) => s.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;

    const offset = 24;
    const extraPadding = 200;

    const newGroupId = nextId++;
    const groupContainerId = nextId++;

    const padHalf = Math.floor(extraPadding / 2);
    const itemsToAdd = saved.snapshot.map((s: any) => ({
      id: oldToNew[s.id],
      status: "available",
      type: s.type,
      itemType: s.itemType,
      x: s.x - minX + offset + padHalf,
      y: s.y - minY + offset + padHalf,
      parentId: s.parentId ? oldToNew[s.parentId] : null,
      groupId: newGroupId,
    } as any));

    const groupContainer = {
      id: groupContainerId,
      type: "group",
      x: Math.max(0, offset - padHalf),
      y: Math.max(0, offset - padHalf),
      width: Math.max(48, width + extraPadding),
      height: Math.max(48, height + extraPadding),
      groupId: newGroupId,
    } as any;

    setTableData((prev) => [...prev, ...itemsToAdd, groupContainer]);
  };

  // Persist savedLayouts to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedLayouts");
      if (raw) setSavedLayouts(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("savedLayouts", JSON.stringify(savedLayouts));
    } catch (e) {
      // ignore
    }
  }, [savedLayouts]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top buttons / nav */}
      <div className="flex space-x-4 p-8 mb-12 items-center">
        <div onClick={() => router.push("/menu")} className="cursor-pointer">
          <Menu />
        </div>
        <div onClick={() => router.push("/kitchen")} className="cursor-pointer">
          <Kitchen />
        </div>
        <div onClick={() => router.push("/analytics")} className="cursor-pointer">
          <Analytics />
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="flex flex-1 transition-all duration-300">
        {/* Table grid */}
        <div
          ref={containerRef}
          onMouseDown={() => setMovingId(null)}
          className="relative flex-1 p-8 transition-all duration-300"
          style={{ marginRight: sidebarOpen ? "30%" : "0" }}
        >
          {tableData
            .filter((item) => item.type !== "group")
            .map((item) => (
              <div
                key={item.id}
                className="absolute transition-transform duration-150 ease-out"
                style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
              >
                {item.type === "table" ? (
                  // compute a user-friendly sequential table number based on current tableData order
                  (() => {
                    const tables = tableData.filter(t => t.type === 'table').sort((a, b) => a.id - b.id);
                    const idx = tables.findIndex(t => t.id === item.id);
                    const displayNumber = idx >= 0 ? idx + 1 : item.id;
                    return (
                      <TableCard
                        id={item.id}
                        displayNumber={displayNumber}
                          variant={(item as any).variant}
                        status={item.status}
                        type="table"
                        isSelected={selectedTable === item.id}
                        isMoving={movingId === item.id}
                        onClick={() => handleTableClick(item.id)}
                        onMoveToggle={handleMoveToggle}
                        onCardMouseDown={handleCardMouseDown}
                        onDoubleClick={() => { setMovingId(item.id); setIsolatedItemId(item.id); }}
                        onDelete={(id) =>
                          setTableData((prev) => prev.filter((t) => t.id !== id))
                        }
                      />
                    );
                  })()
                ) : item.type === "marker" ? (
                  <Marker
                    id={item.id}
                    markerNumber={item.markerNumber!}
                    status={item.status}
                    isSelected={selectedTable === item.id}
                    isMoving={movingId === item.id}
                    onClick={() => handleTableClick(item.id)}
                    onMoveToggle={handleMoveToggle}
                    onCardMouseDown={handleCardMouseDown}
                    onDoubleClick={() => { setMovingId(item.id); setIsolatedItemId(item.id); }}
                    onDelete={(id) =>
                      setTableData((prev) => prev.filter((t) => t.id !== id))
                    }
                    onStatusForward={handleMarkerForward}
                    onStatusBackward={handleMarkerBackward}
                  />
                ) : (
                  <div
                    onClick={() => handleTableClick(item.id)}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setPressedItemId(item.id);
                      if ((item as any).groupId && movingId !== item.id) return;
                      handleCardMouseDown(e, item.id);
                      const onUp = () => {
                        setPressedItemId(null);
                        window.removeEventListener("mouseup", onUp);
                      };
                      window.addEventListener("mouseup", onUp);
                    }}
                    className={`relative w-28 h-28 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-150 ${
                      movingId === item.id ? "scale-110 z-50" : ""
                    }`}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setMovingId(item.id);
                      setIsolatedItemId(item.id);
                    }}
                  >
                    {(isolatedItemId === item.id || pressedItemId === item.id) && (
                      <div className="absolute top-1 right-1 flex space-x-2 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMovingId(item.id);
                            setIsolatedItemId(item.id);
                          }}
                          className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow"
                          title="Move"
                        >
                          <img src="/move button.svg" alt="move" className="w-4 h-4" />
                        </button>
                        {((item as any).groupId && isolatedItemId === item.id) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTableData((prev) => prev.map((p) => (p.id === item.id ? { ...p, groupId: null } : p)));
                              setIsolatedItemId(null);
                            }}
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow"
                            title="Ungroup"
                          >
                            <img src="/ungroup button.svg" alt="ungroup" className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTableData((prev) => prev.filter((t) => t.id !== item.id));
                            setSelectedTable(null);
                            if (isolatedItemId === item.id) setIsolatedItemId(null);
                          }}
                          className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow"
                          title="Delete"
                        >
                          <img src="/trash button.svg" alt="delete" className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="w-full h-full">
                      <img
                        src={`/${(item.itemType || "right chair").replace(/-/g, " ")}.svg`}
                        alt={item.itemType}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

          {tableData
            .filter((item) => item.type === "group")
            .map((g: any) => {
              const hasIsolation = isolatedItemId != null && tableData.some((t) => t.id === isolatedItemId && (t as any).groupId === g.groupId);
              return (
                <div
                  key={g.id}
                  className="absolute z-40"
                  style={{ transform: `translate(${g.x}px, ${g.y}px)` }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    if (e.detail === 2) return;
                    if (!hasIsolation) handleGroupMouseDown(e as any, g.id, g.groupId);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;

                    const candidates = tableData.filter((t) => (t as any).groupId === g.groupId);
                    if (!candidates.length) return;

                    const tables = candidates.filter((c) => c.type === "table");
                    let target: any = null;

                    const findNearest = (list: any[]) => {
                      let nearest = list[0];
                      let best = Infinity;
                      for (const c of list) {
                        const dx = (c.x ?? 0) - clickX;
                        const dy = (c.y ?? 0) - clickY;
                        const d = Math.hypot(dx, dy);
                        if (d < best) {
                          best = d;
                          nearest = c;
                        }
                      }
                      return { nearest, best };
                    };

                    if (tables.length) {
                      const { nearest, best } = findNearest(tables);
                      target = nearest;
                      
                      if (best < 256) {
                        setMovingId(target.id);
                        setIsolatedItemId(target.id);
                      }
                      return;
                    }

                    const { nearest, best } = findNearest(candidates);
                    if (best < 96) {
                      setMovingId(nearest.id);
                      setIsolatedItemId(nearest.id);
                    }
                  }}
                >
                  <div
                    style={{ width: `${g.width}px`, height: `${g.height}px` }}
                    className={`relative border-2 border-dashed border-[#AF3939] bg-transparent rounded-md cursor-grab ${
                      movingGroupId === g.groupId ? "opacity-80" : "opacity-60"
                    } ${hasIsolation ? "pointer-events-none opacity-30 border-transparent" : ""}`}
                  >
                    {!hasIsolation && (
                      <div className="absolute top-2 right-2 z-50 flex space-x-2">
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            
                            setMovingGroupId(g.groupId);
                          }}
                          className="w-8 h-8 flex items-center justify-center"
                          title="Move group"
                        >
                          <img src="/move button.svg" alt="move group" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTableData((prev) => prev.filter((t) => (t as any).groupId !== g.groupId && !(t.type === "group" && (t as any).groupId === g.groupId)));
                          }}
                          className="w-8 h-8 flex items-center justify-center "
                          title="Delete group"
                        >
                          <img src="/trash button.svg" alt="delete group" className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddItem={handleAddItem}
          markers={tableData.filter((t) => t.type === "marker")}
          selectedMarker={selectedTable}
          setSelectedMarker={setSelectedTable}
          onUpdateOrder={(ticketId) => {
            setMenuTicketId(ticketId);
            setShowMenu(true);
            setMenuVisible(true);
          }}
          onChangeMarkerStatus={(id, status) => {
            setTableData(prev => prev.map(item => {
              if (item.id === id && item.type === 'marker') {
                if (status === 'ordering') return { ...item, status, statusUpdatedAt: Date.now() };
                if (status === 'available') return { ...item, status, statusUpdatedAt: undefined };
                return { ...item, status };
              }
              return item;
            }));
          }}
          onSaveLayout={handleSaveLayout}
          savedLayouts={savedLayouts}
          onLoadLayout={handleLoadLayout}
          onDuplicateLayout={handleDuplicateLayout}
          onDeleteLayout={handleDeleteLayout}
        />
      </div>

      {/* Menu Overlay */}
      {menuVisible && menuTicketId && (
        <div className={`fixed inset-0 z-50 transition-all duration-500 ease-out ${showMenu ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <MenuOverlay ticketId={menuTicketId} onClose={() => { setShowMenu(false); setTimeout(() => setMenuVisible(false), 500); }} />
        </div>
      )}
    </div>
  );
}
