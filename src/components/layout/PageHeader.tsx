import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  hexColor: string;
  badge?: string;
  rightAction?: React.ReactNode;
  children?: React.ReactNode; // Tabs ou Stats bar
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  hexColor,
  badge,
  rightAction,
  children,
  className
}: PageHeaderProps) => {
  // Convert hex to RGB for opacity manipulation if needed, 
  // but here we can use style inline for specific opacities requested.
  
  return (
    <div 
      className={cn(
        "relative w-full bg-[#141418] border border-[#2a2a35] rounded-[18px] overflow-hidden mb-6 transition-all duration-300",
        className
      )}
    >
      {/* Top Gradient Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px]" 
        style={{ 
          background: `linear-gradient(90deg, ${hexColor} 0%, transparent 100%)`,
          opacity: 0.8
        }}
      />

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Icon Box */}
            <div 
              className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                backgroundColor: `${hexColor}1F`, // 12% opacity (approx 1F in hex)
                borderColor: `${hexColor}4D`, // 30% opacity (approx 4D in hex)
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: `0 0 15px ${hexColor}33` // Glow effect
              }}
            >
              <Icon 
                size={22} 
                style={{ color: hexColor }}
                strokeWidth={2}
              />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col">
              <h1 className="font-rajdhani font-bold text-[22px] text-white leading-tight">
                {title}
              </h1>
              <span className="font-exo2 text-[11px] text-[#6b6b7a] font-medium mt-0.5">
                {subtitle}
              </span>
            </div>
          </div>

          {/* Right Actions / Badge */}
          <div className="flex items-center gap-3">
            {badge && (
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-rajdhani font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: `${hexColor}1A`, // 10%
                  borderColor: `${hexColor}33`, // 20%
                  color: hexColor
                }}
              >
                {badge}
              </span>
            )}
            {rightAction}
          </div>
        </div>

        {/* Bottom Content (Tabs/Stats) */}
        {children && (
          <div className="mt-5 pt-4 border-t border-[#2a2a35]">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};