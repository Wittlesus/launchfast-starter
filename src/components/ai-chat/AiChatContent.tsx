"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Bot,
  CreditCard,
  Settings,
  LogOut,
  Send,
  Plus,
  MessageSquare,
  Trash2,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { SystemPromptSelector } from "./SystemPromptSelector";
import { UsageStats } from "./UsageStats";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokensUsed?: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

interface AiChatContentProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "AI Chat", icon: Bot, href: "/dashboard/ai-chat", active: true },
  { label: "Billing", icon: CreditCard, href: "/dashboard" },
  { label: "Settings", icon: Settings, href: "/dashboard" },
];

export default function AiChatContent({ user }: AiChatContentProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [usage, setUsage] = useState({
    messagesUsedToday: 0,
    dailyLimit: 50,
    totalTokensUsed: 0,
    hasPaidSubscription: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    loadUsage();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/ai/conversations");
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadUsage = async () => {
    try {
      const res = await fetch("/api/ai/usage");
      const data = await res.json();
      setUsage(data);
    } catch (error) {
      console.error("Failed to load usage:", error);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/conversations/${id}`);
      const data = await res.json();
      setCurrentConversation(data.conversation);
      setMessages(data.conversation.messages || []);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
    setInputMessage("");
  };

  const deleteConversation = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;

    try {
      await fetch(`/api/ai/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentConversation?.id === id) {
        startNewConversation();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    // Add temporary assistant message
    const tempAssistantMsg: Message = {
      id: `temp-assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempAssistantMsg]);

    try {
      abortControllerRef.current = new AbortController();

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConversation?.id,
          message: userMessage,
          systemPrompt: systemPrompt || undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send message");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let assistantContent = "";
      let conversationId = currentConversation?.id;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.text) {
                assistantContent += data.text;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    lastMsg.content = assistantContent;
                  }
                  return newMessages;
                });
              }

              if (data.done) {
                conversationId = data.conversationId;
                // Update usage stats
                if (data.usage) {
                  setUsage((prev) => ({
                    ...prev,
                    messagesUsedToday: data.usage.messagesUsedToday,
                  }));
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Reload conversations to get updated list
      await loadConversations();
      await loadUsage();

      // If new conversation was created, load it
      if (conversationId && !currentConversation) {
        await loadConversation(conversationId);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        // Request was cancelled
        return;
      }
      console.error("Send message error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          lastMsg.content =
            "Sorry, an error occurred. Please try again.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">
            LaunchFast
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <ItemIcon className="h-5 w-5" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations list */}
        <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Button
              variant="primary"
              size="sm"
              onClick={startNewConversation}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors group relative ${
                    currentConversation?.id === conv.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <UsageStats
              messagesUsedToday={usage.messagesUsedToday}
              dailyLimit={usage.dailyLimit}
              hasPaidSubscription={usage.hasPaidSubscription}
            />
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {currentConversation?.title || "New Chat"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user.email && (
                <span className="hidden sm:inline text-sm text-gray-500">
                  {user.email}
                </span>
              )}
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Start a conversation
                </h2>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                  Ask me anything! I&apos;m powered by Claude Sonnet 4.5, one of
                  the most advanced AI models available.
                </p>
                <SystemPromptSelector
                  value={systemPrompt}
                  onChange={setSystemPrompt}
                />
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-4 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-2xl rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content || (
                          <span className="inline-flex items-center gap-2">
                            <span className="animate-pulse">Thinking</span>
                            <Zap className="h-3 w-3 animate-bounce" />
                          </span>
                        )}
                      </p>
                      {msg.tokensUsed && msg.tokensUsed > 0 && (
                        <p className="text-xs text-gray-400 mt-2">
                          {msg.tokensUsed.toLocaleString()} tokens
                        </p>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-4">
            {messages.length > 0 && systemPrompt && (
              <div className="mb-3">
                <SystemPromptSelector
                  value={systemPrompt}
                  onChange={setSystemPrompt}
                />
              </div>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
              />
              <Button
                variant="primary"
                size="md"
                loading={isLoading}
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {usage.messagesUsedToday}/{usage.dailyLimit} messages used today
              {!usage.hasPaidSubscription && (
                <>
                  {" • "}
                  <a href="/pricing" className="text-gray-900 hover:underline">
                    Upgrade for more
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
