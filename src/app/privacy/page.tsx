import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - LaunchFast",
  description:
    "Privacy Policy for LaunchFast SaaS boilerplate. Learn how we handle your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <article className="prose prose-gray mx-auto max-w-3xl px-6">
          <h1>Privacy Policy</h1>
          <p>
            <strong>Last updated: February 14, 2026</strong>
          </p>
          <p>
            This Privacy Policy explains how LaunchFast (&ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) handles your information
            when you purchase our digital products. We keep it simple because
            our data practices are simple.
          </p>

          <h2>The Short Version</h2>
          <p>
            We collect almost nothing. We don&rsquo;t run a web app with user
            accounts. We sell digital downloads. The only data we have about you
            is what Stripe (our payment processor) shares with us when you make a
            purchase.
          </p>

          <h2>What Data We Collect</h2>

          <h3>Data collected through Stripe (payment processor)</h3>
          <p>
            When you purchase a product, Stripe collects and processes:
          </p>
          <ul>
            <li>
              Your <strong>email address</strong>
            </li>
            <li>
              Your <strong>payment information</strong> (credit card, billing
              address)
            </li>
            <li>
              <strong>Transaction details</strong> (what you bought, when, and
              how much you paid)
            </li>
          </ul>
          <p>
            We receive your email address and transaction details from Stripe. We{" "}
            <strong>never</strong> see or store your full credit card number
            &mdash; Stripe handles all of that securely on their end.
          </p>

          <h3>Data we do NOT collect</h3>
          <ul>
            <li>We do not have user accounts on our sales site</li>
            <li>
              We do not use cookies for tracking on our landing page
            </li>
            <li>
              We do not use analytics tools that collect personal data
            </li>
            <li>
              We do not collect usage data from the products you build
            </li>
            <li>
              Our products (source code templates) run on your own infrastructure
              &mdash; we have no access to your users&rsquo; data
            </li>
          </ul>

          <h2>How We Use Your Data</h2>
          <p>We use your email address for exactly two things:</p>
          <ol>
            <li>
              <strong>Delivering your purchase</strong> &mdash; sending you
              download links and license information
            </li>
            <li>
              <strong>Product updates</strong> &mdash; occasionally notifying you
              about important updates to the code you purchased (security fixes,
              major releases)
            </li>
          </ol>
          <p>
            That&rsquo;s it. No marketing newsletters unless you explicitly opt
            in. No spam.
          </p>

          <h2>Third-Party Services</h2>
          <ul>
            <li>
              <strong>Stripe</strong> processes payments. Their privacy policy:{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                stripe.com/privacy
              </a>
            </li>
            <li>
              <strong>GitHub</strong> hosts our source code repositories. Their
              privacy policy:{" "}
              <a
                href="https://docs.github.com/en/site-policy/privacy-policies"
                target="_blank"
                rel="noopener noreferrer"
              >
                docs.github.com/en/site-policy/privacy-policies
              </a>
            </li>
            <li>
              <strong>Vercel</strong> hosts our landing page. Their privacy
              policy:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com/legal/privacy-policy
              </a>
            </li>
          </ul>
          <p>
            We do not sell, rent, or share your personal data with any other
            third parties.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your email address and purchase records for as long as
            necessary to:
          </p>
          <ul>
            <li>Provide you with product updates</li>
            <li>
              Handle refund requests (within our 14-day refund window)
            </li>
            <li>Comply with legal and tax obligations</li>
          </ul>

          <h2>Your Rights (GDPR &amp; CCPA)</h2>
          <p>Regardless of where you live, you have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong> &mdash; Request a copy of any personal data
              we hold about you
            </li>
            <li>
              <strong>Correction</strong> &mdash; Ask us to correct inaccurate
              data
            </li>
            <li>
              <strong>Deletion</strong> &mdash; Ask us to delete your personal
              data (subject to legal retention requirements like tax records)
            </li>
            <li>
              <strong>Portability</strong> &mdash; Receive your data in a
              standard, machine-readable format
            </li>
            <li>
              <strong>Objection</strong> &mdash; Object to processing of your
              data for any purpose beyond delivering your purchase
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:patricksereyouch@gmail.com">
              patricksereyouch@gmail.com
            </a>{" "}
            with your request. We&rsquo;ll respond within 30 days.
          </p>

          <h2>Data Security</h2>
          <p>
            We follow reasonable security practices to protect your information.
            Since we store very little data ourselves (Stripe handles the
            sensitive stuff), our attack surface is minimal. We use HTTPS
            everywhere and follow secure development practices.
          </p>

          <h2>Children&rsquo;s Privacy</h2>
          <p>
            We do not knowingly sell products to or collect data from children
            under 16. Our products are developer tools intended for adult
            professionals.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            If we make material changes to this Privacy Policy, we&rsquo;ll
            update the &ldquo;Last updated&rdquo; date at the top. We encourage
            you to review this page periodically.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy-related questions or requests, email us at{" "}
            <a href="mailto:patricksereyouch@gmail.com">
              patricksereyouch@gmail.com
            </a>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
