"use client";

import { Sparkles } from "lucide-react";

const SYSTEM_PROMPTS = [
  {
    id: "default",
    name: "General Assistant",
    description: "Helpful, accurate, and versatile",
    prompt:
      "You are a helpful AI assistant integrated into a SaaS application. Provide clear, concise, and accurate responses.",
  },
  {
    id: "code",
    name: "Code Expert",
    description: "Programming and technical help",
    prompt:
      "You are an expert software engineer. Provide detailed, well-commented code examples and explain technical concepts clearly. Focus on best practices, performance, and security.",
  },
  {
    id: "creative",
    name: "Creative Writer",
    description: "Stories, content, and ideas",
    prompt:
      "You are a creative writing assistant. Help with storytelling, content creation, brainstorming ideas, and crafting engaging narratives. Be imaginative and expressive.",
  },
  {
    id: "business",
    name: "Business Advisor",
    description: "Strategy and analysis",
    prompt:
      "You are a business consultant with expertise in strategy, marketing, and operations. Provide actionable advice, data-driven insights, and professional recommendations.",
  },
  {
    id: "teacher",
    name: "Patient Teacher",
    description: "Learn new concepts",
    prompt:
      "You are a patient and encouraging teacher. Break down complex topics into simple explanations, use analogies, and provide examples. Adapt your teaching style to the learner's level.",
  },
  {
    id: "researcher",
    name: "Research Assistant",
    description: "Deep analysis and research",
    prompt:
      "You are a meticulous research assistant. Provide well-researched, detailed answers with logical structure. Cite reasoning clearly and consider multiple perspectives.",
  },
];

interface SystemPromptSelectorProps {
  value: string;
  onChange: (prompt: string) => void;
}

export function SystemPromptSelector({
  value,
  onChange,
}: SystemPromptSelectorProps) {
  const selectedPrompt =
    SYSTEM_PROMPTS.find((p) => p.prompt === value) || SYSTEM_PROMPTS[0];

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Sparkles className="h-4 w-4 text-purple-500" />
        AI Persona
      </label>
      <select
        value={selectedPrompt?.id || "default"}
        onChange={(e) => {
          const selected = SYSTEM_PROMPTS.find((p) => p.id === e.target.value);
          onChange(selected?.prompt || "");
        }}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
      >
        {SYSTEM_PROMPTS.map((prompt) => (
          <option key={prompt.id} value={prompt.id}>
            {prompt.name} - {prompt.description}
          </option>
        ))}
      </select>
      {selectedPrompt && (
        <p className="text-xs text-gray-500">{selectedPrompt.description}</p>
      )}
    </div>
  );
}
