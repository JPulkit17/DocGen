"use client";

import { AlertTriangle, Activity } from "lucide-react";

const getRiskColor = (risk) => {
  switch (risk) {
    case "CRITICAL":
      return "bg-destructive/20 border-destructive/50 text-destructive";
    case "HIGH":
      return "bg-accent/20 border-accent/50 text-accent";
    default:
      return "bg-muted/20 border-muted/50 text-foreground";
  }
};

const getRiskIcon = (risk) => {
  return risk === "CRITICAL" ? "🔴" : "⚠️";
};

export default function HighRiskPanel({ logs, totalLogs }) {
  const criticalCount = logs.filter(
    (log) => log.risk_level === "CRITICAL"
  ).length;
  const highCount = logs.filter((log) => log.risk_level === "HIGH").length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-4 py-4 bg-card sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">
            High Risk Alerts
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-destructive/10 border border-destructive/30 rounded px-2 py-1.5">
            <div className="text-destructive font-semibold">
              {criticalCount}
            </div>
            <div className="text-destructive/70 text-xs">Critical</div>
          </div>
          <div className="bg-accent/10 border border-accent/30 rounded px-2 py-1.5">
            <div className="text-accent font-semibold">{highCount}</div>
            <div className="text-accent/70 text-xs">High</div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No high-risk entities</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`rounded-lg border p-3 transition-all hover:shadow-lg ${getRiskColor(
                log.risk_level
              )}`}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{getRiskIcon(log.risk_level)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs mb-1 truncate">
                    {log.entity_type}
                  </div>
                  <div className="text-xs opacity-80 break-all">{log.text}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs opacity-70">
                <div>Score: {log.score.toFixed(2)}</div>
                <div className="truncate">ID: {log.correlation_id}</div>
                <div className="text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
