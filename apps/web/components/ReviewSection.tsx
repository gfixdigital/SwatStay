"use client";

import { ChevronLeft, ChevronRight, MessageSquareText, ShieldCheck, Star } from "lucide-react";
import { useRef, useState } from "react";
import { Reveal } from "./Animated";
// import { approvedReviews } from "@/data/reviews.preview";
import { approvedReviews } from "@/data/reviews";

export function ReviewSection() {
  const reviews = approvedReviews;
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-review-card]");
    const amount = (card?.offsetWidth ?? track.clientWidth) + 16;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <section className="section border-t border-border bg-white">
      <div className="container">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow">TRAVELER FEEDBACK</div>
              <h2 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">What travelers say</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-stone">
                <ShieldCheck size={14} className="text-river" /> Verified post-trip reviews only
              </span>
              {reviews.length > 0 && (
                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => scrollByCard(-1)}
                    disabled={atStart}
                    aria-label="Previous reviews"
                    className="grid h-9 w-9 place-items-center rounded-brand border border-border bg-white text-stone transition hover:border-river hover:text-river disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollByCard(1)}
                    disabled={atEnd}
                    aria-label="Next reviews"
                    className="grid h-9 w-9 place-items-center rounded-brand border border-border bg-white text-stone transition hover:border-river hover:text-river disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {reviews.length === 0 ? (
          <Reveal delay={0.05}>
            <div className="flex flex-col items-start gap-3 rounded-brand border border-dashed border-border bg-mist/60 p-6 sm:items-center sm:text-center md:p-10">
              <span className="grid h-11 w-11 place-items-center rounded-brand bg-white text-river shadow-editorial">
                <MessageSquareText size={20} />
              </span>
              <p className="max-w-md text-sm leading-6 text-stone sm:mx-auto">
                No reviews have been published yet. Verified reviews from travelers appear here after their trip is
                completed and the review passes moderation.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.05}>
            <div
              ref={trackRef}
              onScroll={updateEdges}
              tabIndex={0}
              role="region"
              aria-label="Traveler reviews, scrollable"
              className="motion-safe:scroll-smooth -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {reviews.map((review) => (
                <article
                  key={review.id}
                  data-review-card
                  className="h-full shrink-0 basis-[86%] snap-start rounded-brand border border-border bg-white p-5 shadow-editorial sm:basis-[47%] lg:basis-[31.5%]"
                >
                  <div className="flex items-center gap-1 text-amber">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={14} fill={starIndex < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-charcoal">{review.quote}</p>
                  <div className="mt-4 border-t border-border pt-3 text-xs text-stone">
                    <strong className="text-charcoal">{review.authorName}</strong> · {review.tripLabel}
                    <br />
                    {review.destination} · {review.travelMonthLabel}
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
