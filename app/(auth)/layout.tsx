import { BookOpenCheck } from "lucide-react"
import React from "react"

function PixelSmiley({ bgColor }: { bgColor: string }) {
  return (
    <div
      className={`w-14 h-14 md:w-16 md:h-16 ${bgColor} border-3 border-black flex items-center justify-center`}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-10 h-10 text-black fill-current"
        style={{ shapeRendering: "crispEdges" }}
      >
        {/* Eyes */}
        <rect x="3" y="3" width="3" height="3" />
        <rect x="10" y="3" width="3" height="3" />
        {/* Mouth */}
        <rect x="2" y="10" width="2" height="2" />
        <rect x="4" y="12" width="8" height="2" />
        <rect x="12" y="10" width="2" height="2" />
      </svg>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main
      lang="id"
      className="max-h-screen bg-[#eef2f5] text-black flex flex-col lg:flex-row font-mono"
    >
      <aside
        className="w-full lg:w-[52%] bg-[#181824] p-8 md:p-14 lg:p-16 flex flex-col justify-between relative min-h-120 lg:min-h-screen border-b-4 lg:border-b-0 lg:border-r-4 border-black"
        aria-label="Studio Photo Booth"
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]"></div>

        {/* TOP BRANDING LOGO */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-[#cbf526] p-2.5 border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center">
            <BookOpenCheck className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1
              className="text-base md:text-lg text-white font-bold tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              openToefl
            </h1>
            <p
              className="text-[11px] text-[#cbf526] tracking-widest uppercase mt-1"
              style={{ fontFamily: "'Silkscreen', monospace" }}
            >
              Platform
            </p>
          </div>
        </div>

        {/* HERO SLOGAN & STICKER DISPLAY */}
        <div className="my-10 lg:my-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 relative z-10">
          {/* Main Headline */}
          <div className="max-w-md">
            <h2
              className="text-2xl sm:text-3xl lg:text-[2.2rem] leading-snug text-white mb-6 uppercase tracking-wider font-bold font-[--font-press-start]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              KELOLA <br />
              <span className="text-[#cbf526] drop-shadow-[3px_3px_0px_#000]">BOOTH</span> DARI{" "}
              <br />
              SATU LAYAR
            </h2>
            <p
              className="text-gray-300 text-lg md:text-xl leading-relaxed"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              Pantau partner, booth, event, dan perangkat photobooth Anda di satu tempat.
            </p>
          </div>

          {/* Vertical Pixel Smileys Sticker */}
          <div className="relative self-center sm:self-auto my-2">
            <div className="absolute inset-0 bg-[#cbf526] translate-x-2.5 translate-y-2.5 border-3 border-black"></div>
            <div className="relative bg-[#eef2f5] border-3 border-black p-2.5 flex flex-col gap-2.5 z-10">
              <PixelSmiley bgColor="bg-[#cbf526]" />
              <PixelSmiley bgColor="bg-[#a272ff]" />
              <PixelSmiley bgColor="bg-[#38bdf8]" />
            </div>
          </div>
        </div>

        {/* FOOTER TEXT */}
        <div className="relative z-10 pt-6 border-t border-gray-800 lg:border-none">
          <p
            className="text-xs text-gray-400 tracking-widest uppercase"
            style={{ fontFamily: "'Silkscreen', monospace" }}
          >
            PLATFORM PHOTOBOOTH • SISTEM MANAJEMEN OPERASIONAL
          </p>
        </div>
      </aside>
      <div className="w-full bg-background lg:w-[48%] flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        {children}
      </div>
    </main>
  )
}
