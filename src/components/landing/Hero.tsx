import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-20 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 ring-1 ring-gray-200">
              Ship your SaaS in days, not months
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Build faster.
            <br />
            <span className="text-gray-400">Launch sooner.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The Next.js boilerplate with authentication, payments, emails, and
            AI built in. Stop wasting weeks on setup. Start building your
            product today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Link
              href="/pricing"
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="https://github.com/Wittlesus/launchfast-starter#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50 transition-colors"
            >
              View Docs
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-x-8 text-sm text-gray-600">
            <div className="flex items-center gap-x-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <Link
                href="https://github.com/Wittlesus/launchfast-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                Open Source on GitHub
              </Link>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-300" />
            <div className="hidden sm:flex items-center gap-x-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Production-tested code</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-300" />
            <div className="hidden sm:flex items-center gap-x-2">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>14-day money-back guarantee</span>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Authentication",
                description:
                  "Google & GitHub OAuth, session management, protected routes — all pre-configured.",
                icon: "🔐",
              },
              {
                title: "Stripe Payments",
                description:
                  "Subscriptions, checkout, billing portal, webhooks — ready to accept money.",
                icon: "💳",
              },
              {
                title: "AI Integration",
                description:
                  "Anthropic Claude API wired up with rate limiting and streaming support.",
                icon: "🤖",
              },
              {
                title: "Email System",
                description:
                  "Transactional emails via Resend with beautiful templates included.",
                icon: "📧",
              },
              {
                title: "Database & ORM",
                description:
                  "Prisma with PostgreSQL, migrations, and type-safe queries out of the box.",
                icon: "🗄️",
              },
              {
                title: "Dashboard",
                description:
                  "Clean, responsive dashboard with sidebar navigation and user settings.",
                icon: "📊",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
