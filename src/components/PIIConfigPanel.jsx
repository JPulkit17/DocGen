import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "./retroui/Input";
import { Button } from "./retroui/Button";
export default function PIIConfigPanel({ piiTypes }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPIITypes = useMemo(() => {
    return piiTypes.filter((pii) =>
      pii.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [piiTypes, searchTerm]);

  // Read-only: no selection logic

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Configure Guardrail</h2>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search PII types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Section title */}
      <div className="p-4 border-b border-border flex items-center">
        <p className="text-sm font-semibold">PII Types</p>
      </div>

      {/* PII List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredPIITypes.map((pii) => (
          <div
            key={pii.id}
            className="flex items-center justify-between p-3 rounded-md bg-background border border-border"
          >
            <p className="text-sm font-medium truncate">{pii.name}</p>
            <input
              type="checkbox"
              checked={pii.selected}
              readOnly
              className="w-4 h-4 ml-3 accent-primary"
            />
          </div>
        ))}
      </div>

      {/* Footer (optional) */}
    </div>
  );
}
