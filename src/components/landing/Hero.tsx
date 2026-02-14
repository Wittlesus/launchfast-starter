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
              href="/signup"
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
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
