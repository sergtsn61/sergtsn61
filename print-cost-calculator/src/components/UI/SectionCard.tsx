import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SectionCard({ title, icon: Icon, iconColor = 'text-accent-primary', children, collapsed, onToggle }: SectionCardProps) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 ${iconColor}`}>
            <Icon size={14} />
          </div>
          <span className="text-sm font-semibold text-text-primary">{title}</span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`text-text-muted transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-out ${collapsed ? 'max-h-0' : 'max-h-[600px]'}`}>
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-border-subtle">
          {children}
        </div>
      </div>
    </div>
  );
}
