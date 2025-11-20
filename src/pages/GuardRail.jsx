import { useRegistryEntities } from "../hooks/useRegistryEntities";
import { useParams } from "react-router-dom";
import PIIConfigPanel from "../components/PIIConfigPanel";
import GuardrailChat from "../components/GuardrailChat";

export default function Guardrail() {
  const params = useParams();
  const projectId = params.id;
  const { data, isLoading, error } = useRegistryEntities();

  if (isLoading) {
    return <div className="p-8 text-center">Loading registry entities...</div>;
  }
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading registry entities
      </div>
    );
  }

  // Assume backend returns array of PII types with selection info
  // If not, you may need to map/transform data here
  return (
    <div className="flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-[340px] min-w-[340px] border-r border-border bg-card flex flex-col">
        <PIIConfigPanel piiTypes={data} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-w-0 flex flex-col h-[80vh]">
        <GuardrailChat
          projectName={`Project ${projectId}`}
          guardrailName="presidi-pii"
          registryEntities={data}
        />
      </div>
    </div>
  );
}
