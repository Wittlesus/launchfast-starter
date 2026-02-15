export default function ProductPreview() {
  return (
    <section className="relative bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See what you get
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A production-ready dashboard with AI chat — not a bare template.
          </p>
        </div>

        {/* Browser mockup */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="ml-4 flex-1 rounded-md bg-white border border-gray-200 px-3 py-1 text-xs text-gray-400">
              localhost:3000/dashboard/chat
            </div>
          </div>

          {/* App content */}
          <div className="flex min-h-[420px] sm:min-h-[480px]">
            {/* Sidebar */}
            <div className="hidden sm:flex w-56 flex-col border-r border-gray-100 bg-gray-900 text-white p-4">
              <div className="text-sm font-bold mb-6 px-2">LaunchFast</div>
              <nav className="space-y-1 text-sm">
                {[
                  { label: "Dashboard", icon: "◻", active: false },
                  { label: "AI Chat", icon: "◈", active: true },
                  { label: "Billing", icon: "◇", active: false },
                  { label: "Settings", icon: "◎", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-md px-2 py-2 ${
                      item.active
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t border-gray-700 text-xs text-gray-500 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-700" />
                  <span className="text-gray-400">you@email.com</span>
                </div>
              </div>
            </div>

            {/* Main content - AI Chat */}
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-900">Claude AI</span>
                  <span className="text-xs text-gray-400">Streaming enabled</span>
                </div>
                <div className="text-xs text-gray-400">
                  142 tokens remaining today
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden p-6 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-br-md bg-black text-white px-4 py-2.5 text-sm">
                    Help me write a function that validates email addresses and returns helpful error messages
                  </div>
                </div>

                {/* AI response */}
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-sm text-gray-800">
                    <p className="mb-2">Here&apos;s a production-ready email validator with clear error messages:</p>
                    <div className="rounded-lg bg-gray-900 text-green-400 p-3 text-xs font-mono leading-relaxed overflow-hidden">
                      <div><span className="text-blue-400">export function</span> validateEmail(email: <span className="text-yellow-300">string</span>)</div>
                      <div className="pl-4"><span className="text-blue-400">if</span> (!email) <span className="text-blue-400">return</span> {"{"} valid: <span className="text-red-400">false</span>,</div>
                      <div className="pl-6">error: <span className="text-green-300">&quot;Email is required&quot;</span> {"}"}</div>
                      <div className="pl-4"><span className="text-blue-400">if</span> (!email.includes(<span className="text-green-300">&apos;@&apos;</span>))</div>
                      <div className="pl-6"><span className="text-blue-400">return</span> {"{"} valid: <span className="text-red-400">false</span>,</div>
                      <div className="pl-6">error: <span className="text-green-300">&quot;Missing @ symbol&quot;</span> {"}"}</div>
                      <div className="text-gray-500">  // ... rate-limited, auth-gated</div>
                    </div>
                    <p className="mt-2 text-gray-500 text-xs">Streaming response · 87 tokens</p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="flex-1 text-sm text-gray-400">Ask Claude anything...</span>
                  <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Real AI chat with streaming, rate limiting &amp; token tracking — included out of the box.
        </p>
      </div>
    </section>
  );
}
