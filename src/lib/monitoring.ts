/**
 * Error tracking and monitoring setup
 *
 * Optional Sentry integration for production error tracking.
 * Enable by setting NEXT_PUBLIC_SENTRY_DSN in your environment.
 */

/**
 * Initialize Sentry for client-side error tracking
 * Call this in your root layout or _app file
 */
export function initSentry() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  // Dynamically import Sentry to avoid bundling if not configured
  // @ts-ignore - Sentry package is optional
  import('@sentry/nextjs')
    .then((Sentry: any) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        // Only send errors in production
        enabled: process.env.NODE_ENV === 'production',

        // Capture unhandled rejections
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],

        // Session Replay sample rate
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,

        beforeSend(event: any) {
          // Don't send events from localhost
          if (event.request?.url?.includes('localhost')) {
            return null;
          }
          return event;
        },
      });
    })
    .catch((err) => {
      console.error('Failed to initialize Sentry:', err);
    });
}

/**
 * Track custom events for analytics
 * Useful for monitoring user behavior and business metrics
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Event:', eventName, properties);
    return;
  }

  // Send to Sentry as breadcrumb
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.addBreadcrumb({
      category: 'analytics',
      message: eventName,
      data: properties,
      level: 'info',
    });
  }

  // Add your analytics provider here (PostHog, Mixpanel, etc.)
  // Example:
  // if (typeof window !== 'undefined' && (window as any).posthog) {
  //   (window as any).posthog.capture(eventName, properties);
  // }
}

/**
 * Track page views
 * Call this in your layout or navigation handler
 */
export function trackPageView(path: string): void {
  trackEvent('page_view', { path });
}

/**
 * Set user context for error tracking
 * Call after successful authentication
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
}): void {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }
}

/**
 * Clear user context
 * Call on logout
 */
export function clearUser(): void {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.setUser(null);
  }
}
