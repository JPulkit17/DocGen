"use client";

import { useEffect, useRef } from "react";

const getRiskColor = (risk) => {
  switch (risk) {
    case "CRITICAL":
      return "text-destructive";
    case "HIGH":
      return "text-accent";
    case "MEDIUM":
      return "text-yellow-400";
    case "LOW":
      return "text-green-400";
    default:
      return "text-foreground";
  }
};

const getRiskBgColor = (risk) => {
  switch (risk) {
    case "CRITICAL":
      return "bg-destructive/10";
    case "HIGH":
      return "bg-accent/10";
    case "MEDIUM":
      return "bg-yellow-400/10";
    case "LOW":
      return "bg-green-400/10";
    default:
      return "bg-muted/5";
  }
};

export default function StreamLogViewer({ logs }) {
  const scrollContainerRef = useRef(null);
  const previousLengthRef = useRef(logs.length);

  useEffect(() => {
    if (scrollContainerRef.current && logs.length > previousLengthRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    previousLengthRef.current = logs.length;
  }, [logs]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto scrollbar-thin bg-background"
    >
      <div className="p-4 space-y-2">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Waiting for stream data...</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-md text-xs font-mono transition-colors ${getRiskBgColor(
                log.risk_level
              )} border border-transparent hover:border-border`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      [{log.timestamp.split("T")[1].split(".")[0]}]
                    </span>
                    <span
                      className={`font-semibold ${getRiskColor(
                        log.risk_level
                      )}`}
                    >
                      {log.risk_level}
                    </span>
                  </div>

                  <div className="text-foreground">
                    <span className="text-primary">{log.entity_type}</span>
                    <span className="text-muted-foreground"> | </span>
                    <span className="break-all">{log.text}</span>
                  </div>

                  <div className="text-muted-foreground space-x-3 text-xs">
                    <span>Score: {log.score.toFixed(2)}</span>
                    <span>ID: {log.correlation_id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
