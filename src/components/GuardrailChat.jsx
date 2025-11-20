import { useState, useRef } from "react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "./retroui/Button";
import { Input } from "./retroui/Input";

export default function GuardrailChat({
  projectName = "Guardrail Chat",
  guardrailName = "presidi-pii",
}) {
  const [messages, setMessages] = useState(() => [
    {
      id: "1",
      role: "user",
      content:
        "My credit card is 4111-1111-1111-1111 and my email is test@example.com.",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "assistant",
      content: "I'm sorry, but I cannot store that information...",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I've received your message and applied guardrail protections.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 shrink-0">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {projectName}
        </h2>
        <p className="text-sm text-muted-foreground">
          Active Guardrail:{" "}
          <span className="font-mono text-primary">{guardrailName}</span>
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md rounded-lg px-4 py-2 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2 border-b border-current/10 pb-1">
                  <span className="text-xs font-semibold">Assistant</span>
                  <span className="text-xs opacity-60">gpt-3.5-turbo</span>
                </div>
              )}
              <p className="text-sm">{msg.content}</p>
              <p className="text-[10px] opacity-60 mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted border border-border rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4 space-y-3 shrink-0">
        <Button
          variant="outline"
          onClick={handleClearChat}
          className="w-full flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </Button>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />

          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
