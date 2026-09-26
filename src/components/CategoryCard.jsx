import React from 'react';
import {
  Mouse,
  Keyboard,
  Headphones,
  Gift,
  Layers,
  SunMedium,
  Laptop,
  Monitor,
  Camera,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Mouse: Mouse,
  Keyboard: Keyboard,
  Headphones: Headphones,
  Gift: Gift,
  Layers: Layers,
  SunMedium: SunMedium,
  Laptop: Laptop,
  Monitor: Monitor,
  Camera: Camera
};

export default function CategoryCard({ category, onSelectCategory, className = '' }) {
  const IconComponent = iconMap[category.iconName] || Layers;

  return (
    <a
      href={`#category/${category.slug || category.id}`}
      onClick={(e) => {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          onSelectCategory(category.slug || category.id);
        }
      }}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-[#120D1A] border border-purple-500/15 hover:border-purple-400/50 hover:bg-[#171020] transition-all duration-300 hover:-translate-y-1 purple-glow-card cursor-pointer block text-left ${className}`}
    >
      <div className="space-y-4">
        {/* Category Icon */}
        <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:text-purple-200 group-hover:border-purple-400/60 transition-colors">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Name & Description */}
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-[#A8A0B8] line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Action link */}
      <div className="pt-4 mt-2 border-t border-purple-900/20 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
        <span>Browse Products</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}
