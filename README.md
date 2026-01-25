#Mai-POS 🪑🍜
A customized point of sale tabling and order management app developed for Mai Shan Yun, College Station. This was made in 24 hours during TamuHack 2026🍉. 

## Features

- **🪑 Interactive Table Grid**
  - Drag-and-drop tables, chairs, and markers.
  - Double-click to isolate items within a group.
  - Snap-to-grid positioning.
  
-  **🍜 Menu Overlay & Order Management**
    - Click on a marker/table to open the menu overlay.
    - Add, update, or delete menu items.
    - Assign menu items directly to specific tables.
    - Automatically generates new tickets for the kitchen when orders are updated

- **📍 Markers with Status**
  - Markers have status states: `Waiting for Service (red)` → `Waiting for Food (yellow)` → `Eating (green)`.
  - Forward/backward cycling of status.

- **💾 Saved Layouts**
  - Save the current arrangement of tables/items/markers.
  - Auto-generated thumbnail previews.
  - Load, delete, or duplicate saved layouts.
 
- **🎨 Canvas & Image Rendering**
  - Generates thumbnails using `html2canvas` with fallback rendering.
  - Supports dynamic rendering of tables, markers, and generic items.
 
- **📊 Analytics Dashboard**
  - View order and sales analytics over:
    - Last 24 hours
    - Last week
    - Last month
    - Last year
  - Track popular items, total sales, and order trends.
  
## 🛠 Tech Stack

- **Frontend**: Next.js (React) with TypeScript
- **State Management**: React Context (`ticketContext`)
- **Styling**: Tailwind CSS
- **Image Handling**: `next/image`
- **Utilities**: `html2canvas` for thumbnail generation

 
