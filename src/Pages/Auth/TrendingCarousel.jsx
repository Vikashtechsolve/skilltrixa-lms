// src/components/TrendingCarousel.jsx
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const TrendingCarousel = ({ total = 10, visible = 5 }) => {
  const slides = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    srcJpg: `/pic${i + 1}.jpg`,
    srcPng: `/pic${i + 1}.png`,
    title: `Slide ${i + 1}`,
  }));

  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Tailwind gap-4 => 1rem => 16px
  const GAP_PX = 16;
  const cardMinWidth = `calc((100% - ${(visible - 1) * GAP_PX}px) / ${visible})`;

  const updateArrows = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const eps = 4;
    setCanScrollLeft(scroller.scrollLeft > eps);
    setCanScrollRight(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - eps);
  };

  useEffect(() => {
    updateArrows();
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => updateArrows();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollByCard = (dir = 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector(".tc-card");
    const style = getComputedStyle(scroller);
    const gap = parseInt(style.getPropertyValue("gap")) || GAP_PX;
    const cardWidth = card ? Math.round(card.getBoundingClientRect().width) : Math.round(scroller.clientWidth / visible);
    const distance = cardWidth + gap;
    scroller.scrollBy({ left: distance * dir, behavior: "smooth" });

    if (dir === -1) setCanScrollRight(true);
    if (dir === 1) setCanScrollLeft(true);

    setTimeout(updateArrows, 300);
  };

  return (
    <section className="w-full px-4 md:px-12 py-8 bg-[#0f0f10] relative">
      <h2 className="text-2xl text-left md:text-3xl font-semibold text-white mb-6">
        Trending Now
      </h2>

      {/* LEFT arrow - visible on md+ */}
      <button
        aria-label="previous"
        onClick={() => scrollByCard(-1)}
        aria-disabled={!canScrollLeft}
        disabled={!canScrollLeft}
        className={`hidden md:flex items-center justify-center h-12 md:h-40 w-10 rounded bg-slate-900 text-white absolute left-3 md:left-0 top-1/2 -translate-y-1/2 z-30 hover:bg-black/80 transition-opacity ${
          !canScrollLeft ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronLeftIcon size={18} />
      </button>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="tc-scroller flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 pr-2"
          style={{ scrollbarWidth: "none" }}
        >
          {slides.map((s) => (
            <div
              key={s.id}
              className="tc-card snap-center w-60 flex-shrink-0 relative rounded-xl overflow-hidden h-[180px] md:h-[260px] lg:h-[300px] bg-gray-900"
              style={{ minWidth: cardMinWidth }}
            >
              <img
                src={s.srcJpg}
                alt={s.title}
                onError={(e) => {
                  if (e.currentTarget.src.includes(".jpg")) {
                    e.currentTarget.src = s.srcPng;
                  } else {
                    e.currentTarget.src =
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(
                        `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
                            <rect fill='#222' width='100%' height='100%'/>
                            <text x='50%' y='50%' fill='#999' font-size='24' font-family='Arial'
                              text-anchor='middle' dominant-baseline='middle'>
                              Image ${s.id}
                           </text>
                          </svg>`
                      );
                  }
                }}
                className="object-cover w-full h-full"
              />

              <div
                className="absolute left-3 bottom-3 pointer-events-none select-none"
                style={{ WebkitTextStroke: "1.6px rgba(0,0,0,0.9)" }}
              >
                <span
                  className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-black drop-shadow-md"
                  style={{
                    WebkitTextStroke: "2px white",
                  }}
                >
                  {s.id}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile arrows (left + right) - visible only on small screens */}
        {/* <div className="md:hidden absolute inset-y-0 left-0 right-0 pointer-events-none">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <button
              onClick={() => scrollByCard(-1)}
              className={`h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center shadow ${
                !canScrollLeft ? "opacity-30 pointer-events-none" : "opacity-100"
              }`}
              aria-label="prev mobile"
              disabled={!canScrollLeft}
              aria-disabled={!canScrollLeft}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <button
              onClick={() => scrollByCard(1)}
              className={`h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center shadow ${
                !canScrollRight ? "opacity-30 pointer-events-none" : "opacity-100"
              }`}
              aria-label="next mobile"
              disabled={!canScrollRight}
              aria-disabled={!canScrollRight}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div> */}
      </div>

      {/* RIGHT arrow - visible on md+ */}
      <button
        aria-label="next"
        onClick={() => scrollByCard(1)}
        aria-disabled={!canScrollRight}
        disabled={!canScrollRight}
        className={`hidden md:flex items-center justify-center h-12 md:h-48 w-10 rounded bg-slate-900 text-white absolute right-3 md:right-0 top-1/2 -translate-y-1/2 z-30 hover:bg-black/80 transition-opacity ${
          !canScrollRight ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronRightIcon size={18} />
      </button>
    </section>
  );
};

export default TrendingCarousel;
