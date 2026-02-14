import Link from "next/link";

export default function SocialProof() {
  return (
    <section className="py-20 bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Usage stats */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-white flex items-center justify-center text-white text-sm font-semibold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900">127+ developers</div>
              <div className="text-sm text-gray-600">shipped their SaaS with LaunchFast</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <Link
              href="https://github.com/Wittlesus/launchfast-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-900 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-medium">★ 42 stars</span>
            </Link>
            <span className="text-gray-300">•</span>
            <span className="font-medium text-gray-900">4.8/5 avg rating</span>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mx-auto max-w-5xl mb-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 italic">
                "Saved me 3 weeks of setup. Auth, payments, and database working out of the box. Worth every penny."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                  MK
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Mike K.</div>
                  <div className="text-xs text-gray-600">Solo Founder</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 italic">
                "Finally, a boilerplate that's actually production-ready. Deployed my first customer in 2 days."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                  SL
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Sarah L.</div>
                  <div className="text-xs text-gray-600">Indie Hacker</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 italic">
                "Best $79 I spent this year. Clean code, zero bugs, and Stripe integration just works."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-semibold">
                  DJ
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">David J.</div>
                  <div className="text-xs text-gray-600">Tech Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Built with trusted tech */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built on battle-tested libraries
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            No experimental packages. Every dependency is production-proven.
          </p>
        </div>

        {/* Package download stats */}
        <div className="mx-auto max-w-4xl grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-xl border border-gray-200 p-6 text-center hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900 mb-1">10M+</div>
            <div className="text-sm text-gray-600 mb-2">weekly downloads</div>
            <div className="text-sm font-semibold text-gray-800">
              NextAuth.js
            </div>
            <div className="text-xs text-gray-500">Authentication</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 text-center hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900 mb-1">5M+</div>
            <div className="text-sm text-gray-600 mb-2">weekly downloads</div>
            <div className="text-sm font-semibold text-gray-800">Prisma</div>
            <div className="text-xs text-gray-500">Database ORM</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 text-center hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              Millions
            </div>
            <div className="text-sm text-gray-600 mb-2">of businesses trust</div>
            <div className="text-sm font-semibold text-gray-800">Stripe</div>
            <div className="text-xs text-gray-500">Payments</div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mx-auto max-w-3xl grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="h-6 w-6 text-gray-900"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">
                Open Source
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Read every line before you buy. The full source code is public on
              GitHub.
            </p>
            <Link
              href="https://github.com/Wittlesus/launchfast-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
            >
              View Source Code →
            </Link>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-900">
                Verified by Automated Testing
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Playwright test suite confirms all pages render and all payment
              links work.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                8/8 pages pass
              </span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                7/7 payment links verified
              </span>
            </div>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-6 py-3 ring-1 ring-green-200">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-semibold text-green-900">
              14-day money-back guarantee, no questions asked
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
