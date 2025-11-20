import { useQuery } from "react-query";

export function useRegistryEntities() {
  return useQuery(["registry-entities"], async () => {
    const res = await fetch(import.meta.env.VITE_GUARDRAIL_API);
    if (!res.ok) throw new Error("Failed to fetch registry entities");
    return res.json();
  });
}
