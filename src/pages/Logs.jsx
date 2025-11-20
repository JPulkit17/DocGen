import { useEffect, useState } from "react";
import StreamLogViewer from "../components/StreamLogViewer";
import HighRiskPanel from "../components/HighRiskPanel";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Connect to SSE endpoint
    const eventSource = new window.EventSource(
      import.meta.env.VITE_PYTHON_FILTER
    );
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        // Expecting: entity_type, score, text, correlation_id, risk_level
        const newLog = {
          id: data.correlation_id || `log-${Date.now()}`,
          entity_type: data.entity_type,
          score: data.score,
          text: data.text,
          correlation_id: data.correlation_id,
          risk_level: data.risk_level,
          timestamp: new Date().toISOString(),
        };
        setLogs((prev) => [newLog, ...prev].slice(0, 100));
      } catch (err) {
        // Optionally handle parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const highRiskLogs = logs.filter(
    (log) => log.risk_level === "HIGH" || log.risk_level === "CRITICAL"
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-foreground">
            Stream Monitor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time entity detection and risk assessment
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left: Full Stream Log */}
        <div className="flex-1 border-r border-border overflow-hidden">
          <StreamLogViewer logs={logs} />
        </div>

        {/* Right: High Risk Entities */}
        <div className="w-96 overflow-hidden bg-card/50">
          <HighRiskPanel logs={highRiskLogs} totalLogs={logs.length} />
        </div>
      </div>
    </main>
  );
}
