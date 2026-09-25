import React from 'react';
import { useSite } from '../context/SiteContext.jsx';

export default function Stats() {
  const { siteConfig } = useSite();
  const statsList = siteConfig.stats || [];

  return (
    <section className="py-4 sm:py-6 border-y border-purple-900/20 bg-[#0B0710]/60 backdrop-blur-sm relative">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsList.map((stat, idx) => {
            const isTextValue = stat.value && stat.value.includes('•');
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl border border-purple-500/15 bg-[#120D1A]/70 hover:border-purple-500/35 transition-colors flex flex-col justify-between min-h-[95px] sm:min-h-[105px] text-left"
              >
                <div>
                  {isTextValue ? (
                    <div className="font-display font-bold text-xs sm:text-sm lg:text-base text-purple-200 tracking-wider uppercase leading-snug">
                      {stat.value}
                    </div>
                  ) : (
                    <div className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight font-mono-nums leading-none">
                      {stat.value}
                    </div>
                  )}
                  <div className="text-xs font-semibold text-purple-300 mt-1">
                    {stat.label}
                  </div>
                </div>

                {stat.description && (
                  <div className="text-[11px] text-[#A8A0B8] line-clamp-1 mt-1">
                    {stat.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
