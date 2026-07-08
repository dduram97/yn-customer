"use client";

import type { TrackingEvent } from "@/lib/tracking/types";

type Props = {
  events: TrackingEvent[];
};

export function TrackingTimeline({ events }: Props) {
  const activeIndex = Math.max(0, events.length - 1);

  return (
    <ol className="relative pl-4">
      <div
        className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-line-200"
        aria-hidden="true"
      />

      {events.map((ev, idx) => {
        const isActive = idx === activeIndex;
        const dotClass = isActive ? "bg-brand-600" : "bg-slate-300";

        return (
          <li key={ev.id} className="relative pb-5 last:pb-0">
            <div
              className={`absolute left-0 top-[6px] h-[10px] w-[10px] rounded-full ${dotClass}`}
              aria-hidden="true"
            />

            <div className="ml-5">
              <div className="text-[14px] font-semibold tracking-[-0.01em] text-ink-950">
                {ev.title}
              </div>
              <div className="mt-0.5 text-[13px] text-ink-700">{ev.location}</div>
              <div className="mt-0.5 text-[12px] text-slate-500">{ev.occurredAt}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

