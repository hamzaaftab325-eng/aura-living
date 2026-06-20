'use client';

import { useRef, useState } from 'react';

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  /** Optional badge count per tab (e.g. unread notifications) */
  badges?: Record<string, number>;
}

/**
 * Reusable Tabs component (WAI-ARIA tabs pattern).
 * Extracted from AdminDashboard pattern for reuse.
 * - role="tablist" / role="tab" / aria-selected
 * - Arrow-key navigation between tabs
 * - Focus visible
 */
export default function Tabs({ tabs, activeTab, onTabChange, className = '', badges }: TabsProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [focusedIdx, setFocusedIdx] = useState(0);

  // Sync focused index with active tab during render (no effect)
  const activeIdx = tabs.findIndex((t) => t.id === activeTab);
  if (activeIdx !== -1 && activeIdx !== focusedIdx) {
    setFocusedIdx(activeIdx);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newIdx = focusedIdx;
    if (e.key === 'ArrowRight') newIdx = (focusedIdx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') newIdx = (focusedIdx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') newIdx = 0;
    else if (e.key === 'End') newIdx = tabs.length - 1;
    else return;

    e.preventDefault();
    setFocusedIdx(newIdx);
    onTabChange(tabs[newIdx].id);
    tabRefs.current[tabs[newIdx].id]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Section tabs"
      className={`flex items-center gap-1 border-b overflow-x-auto ${className}`}
      style={{ borderBottomColor: 'var(--border-default)' }}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const badgeCount = badges?.[tab.id];
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap relative"
            style={{
              color: isActive ? 'var(--text-gold)' : 'var(--text-muted)',
              borderBottom: isActive ? '2px solid var(--color-gold)' : '2px solid transparent',
              marginBottom: '-1px' }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {badgeCount !== undefined && badgeCount > 0 && (
              <span
                className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--color-danger)', color: 'white' }}
              >
                {badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
