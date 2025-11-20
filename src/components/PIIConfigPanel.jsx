import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Input } from "./retroui/Input";
import { Button } from "./retroui/Button";
import { useMutation } from "@tanstack/react-query";

export default function PIIConfigPanel({ piiTypes, projectId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [guardrailName, setGuardrailName] = useState("");
  const [selected, setSelected] = useState(() => {
    if (!piiTypes || !Array.isArray(piiTypes)) return {};
    return Object.fromEntries(
      piiTypes.map((pii) => [pii.id, !!pii.default_enabled])
    );
  });

  React.useEffect(() => {
    if (!piiTypes || !Array.isArray(piiTypes)) return;
    setSelected(
      Object.fromEntries(piiTypes.map((pii) => [pii.id, !!pii.default_enabled]))
    );
  }, [piiTypes]);

  const filteredPIITypes = useMemo(() => {
    if (!piiTypes || !Array.isArray(piiTypes) || piiTypes.length === 0) {
      return [];
    }
    return piiTypes.filter((pii) => {
      if (!pii || !pii.name) {
        return false;
      }
      return pii.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [piiTypes, searchTerm]);

  const selectedPIIIds = useMemo(() => {
    return Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);
  }, [selected]);

  const createGuardrailMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: guardrailName,
      };
      const response = await fetch(
        import.meta.env.VITE_CREATE_GUARDRAIL_PROJECT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save guardrail configuration");
      }
      return response.json();
    },
  });

  const attachProjectMutation = useMutation({
    mutationFn: async ({ projectId, id }) => {
      const payload = { guardrailIds: [id] };
      const response = await fetch(
        String(import.meta.env.VITE_GITHUB_PROJECTS) + `/${projectId}/config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to attach project");
      }
      return response.json();
    },
  });

  const saveSelectedPIIMutation = useMutation({
    mutationFn: async ({ id }) => {
      const payload = {
        registryEntityIds: selectedPIIIds,
      };
      const response = await fetch(
        String(import.meta.env.VITE_CREATE_GUARDRAIL_PROJECT) + `/${id}/config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save selected PII types");
      }
      return response.json();
    },
  });

  const handleSave = () => {
    createGuardrailMutation.mutate(undefined, {
      onSuccess: async (res) => {
        const id = res.id;
        attachProjectMutation.mutate(
          { projectId, id },
          {
            onSuccess: async () => {
              saveSelectedPIIMutation.mutate({ id });
            },
          }
        );
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Configure Guardrail</h2>

        {/* Guardrail Name Input */}
        <Input
          placeholder="Enter guardrail name..."
          value={guardrailName}
          onChange={(e) => setGuardrailName(e.target.value)}
          className="mb-4"
        />

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
      <div className="p-4 border-b border-border flex items-center justify-between">
        <p className="text-sm font-semibold">PII Types</p>
        <Button
          onClick={handleSave}
          className="text-xs font-medium text-foreground hover:underline"
        >
          Save
        </Button>
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
              checked={!!selected[pii.id]}
              disabled={pii.default_enabled}
              onChange={() =>
                setSelected((prev) => ({ ...prev, [pii.id]: !prev[pii.id] }))
              }
              className="w-4 h-4 ml-3 accent-primary"
            />
          </div>
        ))}
      </div>

      {/* Footer (optional) */}
    </div>
  );
}
