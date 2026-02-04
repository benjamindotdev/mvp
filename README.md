# Modular Vector Playground (MVP)

A lightweight web tool that lets developers visually combine SVG/Lucide-style icons into a single composed vector and export it as a clean SVG for MVP branding.

## Problem

Early-stage products and side projects need “good enough” branding fast. Design tools are heavy, slow, or overkill for simple icon compositions. Developers often want to:

*   Combine 2–4 icons
*   Adjust size, rotation, layering
*   Export a single SVG they can drop into a repo or UI

## Solution

A modular SVG composition playground:

*   Select base icons (Lucide)
*   Overlay additional icons
*   Adjust transform values visually
*   Export a final SVG (no raster, no proprietary formats)
*   No accounts. No backend. No design fluff.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **State**: Local React State + LocalStorage

## Getting Started

1.  Clone the repository
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000)

## Features

*   **Icon Library**: Categorized Lucide icons.
*   **Canvas**: Fixed square canvas (default 512x512) for composition.
*   **Layers**: Stack multiple icons, reorder, duplicate, delete.
*   **Controls**: Position, Scale, Rotation, Opacity, Color.
*   **Export**: Clean SVG export without editor metadata.
*   **Persistence**: Auto-saves to LocalStorage.

## License

MIT
