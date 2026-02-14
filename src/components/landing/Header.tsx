import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold text-gray-900">
          LaunchFast
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="https://github.com/Wittlesus/launchfast-starter#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
