/**
 * Collapsible panel for Visitor Tracker + API Status Checker.
 * Collapsed by default so the full page is visible; expand on click.
 */
import React, { useState } from 'react';
import VisitorTracker from './VisitorTracker';
import ApiStatusChecker from './ApiStatusChecker';

export default function CollapsibleDevTools({ showInProduction = false }) {
  const [expanded, setExpanded] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && !showInProduction) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[1001] flex flex-col items-end gap-2"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {expanded && (
        <div className="flex flex-col gap-3 max-h-[85vh] overflow-auto">
          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-lg overflow-hidden max-w-[400px]">
            <VisitorTracker showDebugInfo />
          </div>
          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-lg overflow-hidden max-w-[400px]">
            <ApiStatusChecker showInProduction={showInProduction} />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground border border-border shadow transition-colors"
        aria-label={expanded ? 'Collapse dev tools' : 'Expand dev tools'}
      >
        {expanded ? '▼ Collapse' : 'Tracker & API'}
      </button>
    </div>
  );
}
