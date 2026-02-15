"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Bot,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface DashboardContentProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { label: "Dashboard", icon: BarChart3, active: true, href: "/dashboard" },
  { label: "AI Chat", icon: Bot, active: false, href: "/dashboard/ai-chat" },
  { label: "Billing", icon: CreditCard, active: false, href: "/dashboard" },
  { label: "Settings", icon: Settings, active: false, href: "/dashboard" },
];

export default function DashboardContent({ user }: DashboardContentProps) {
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  const handleAiSubmit = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiResponse(data.response ?? data.error ?? "No response received.");
    } catch {
      setAiResponse("Something went wrong. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setBillingLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">LaunchFast</span>
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

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            {user.email && (
              <span className="hidden sm:inline text-sm text-gray-500">
                {user.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="lg:hidden"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Welcome */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back{user.name ? `, ${user.name}` : ""}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Here&apos;s an overview of your account.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "API Requests", value: "0" },
                { label: "Active Users", value: "1" },
                { label: "Revenue", value: "$0" },
                { label: "Plan", value: "Free" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Assistant card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                AI Assistant
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Ask anything and get an AI-powered response.
              </p>

              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAiSubmit();
                    }
                  }}
                  placeholder="Type your prompt..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <Button
                  variant="primary"
                  size="md"
                  loading={aiLoading}
                  onClick={handleAiSubmit}
                >
                  Send
                </Button>
              </div>

              {aiResponse && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {aiResponse}
                  </p>
                </div>
              )}
            </div>

            {/* Billing card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your subscription and payment methods.
              </p>

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="md"
                  loading={billingLoading}
                  onClick={handleManageBilling}
                >
                  Manage Billing
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
