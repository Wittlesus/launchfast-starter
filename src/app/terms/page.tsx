import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - LaunchFast",
  description:
    "Terms of Service for LaunchFast SaaS boilerplate. Understand your rights and obligations.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <article className="prose prose-gray mx-auto max-w-3xl px-6">
          <h1>Terms of Service</h1>
          <p>
            <strong>Last updated: February 14, 2026</strong>
          </p>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your purchase
            and use of digital products sold through LaunchFast (&ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By purchasing any product,
            you agree to these Terms.
          </p>

          <h2>What You&rsquo;re Buying</h2>
          <p>
            When you purchase a LaunchFast product, you&rsquo;re buying a{" "}
            <strong>license to use source code</strong> &mdash; not a
            subscription, not a hosted service. You receive a digital download of
            source code, templates, and related files. There is no ongoing
            service obligation on our part beyond delivering the files you
            purchased.
          </p>

          <h2>License Tiers</h2>
          <p>We offer two license tiers:</p>
          <ul>
            <li>
              <strong>Standard License ($79):</strong> A personal use license for{" "}
              <strong>1 developer</strong>. You may use the code in unlimited
              personal and commercial projects. You may not share the source code
              with other developers.
            </li>
            <li>
              <strong>Pro License ($119):</strong> A team license for{" "}
              <strong>up to 5 developers</strong> within the same organization.
              All licensed developers may use the code in unlimited personal and
              commercial projects.
            </li>
          </ul>

          <h2>What You Can Do</h2>
          <ul>
            <li>
              Use the code to build any application (personal, commercial, client
              work)
            </li>
            <li>Modify the code however you want</li>
            <li>Deploy unlimited projects built with the code</li>
            <li>
              Use it forever &mdash; your license does not expire
            </li>
          </ul>

          <h2>What You Cannot Do</h2>
          <ul>
            <li>
              <strong>Redistribute the source code</strong> as a template,
              boilerplate, starter kit, or competing product
            </li>
            <li>
              Share, resell, or sublicense the source code itself to others
              outside your license tier
            </li>
            <li>
              Claim the original template code as your own creation for resale as
              a template
            </li>
          </ul>
          <p>
            To be clear: you can absolutely build and sell SaaS products,
            websites, and applications using this code. You just can&rsquo;t
            resell the <em>template itself</em> as a development tool.
          </p>

          <h2>No Warranty</h2>
          <p>
            The software is provided <strong>&ldquo;as is&rdquo;</strong> without
            warranty of any kind, express or implied. We do not guarantee that
            the code will be error-free, secure, or suitable for any particular
            purpose. You are responsible for testing and validating the code
            before using it in production.
          </p>

          <h2>Refund Policy</h2>
          <p>
            We offer a <strong>14-day money-back guarantee</strong>, no questions
            asked. If you&rsquo;re not satisfied for any reason, email us within
            14 days of purchase with your order number and we&rsquo;ll process a
            full refund.
          </p>
          <p>
            After a refund is processed, your license is revoked and you must
            delete all copies of the source code.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenue, whether incurred directly
            or indirectly, or any loss of data, use, goodwill, or other
            intangible losses resulting from:
          </p>
          <ul>
            <li>Your use or inability to use the software</li>
            <li>Any bugs, errors, or vulnerabilities in the code</li>
            <li>
              Any unauthorized access to or alteration of your applications built
              with the code
            </li>
            <li>
              Any third-party services or integrations referenced in the code
            </li>
          </ul>
          <p>
            Our total liability for any claim arising from these Terms shall not
            exceed the amount you paid for the product.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The original source code, design, and documentation remain our
            intellectual property. Your license grants you usage rights as
            described in these Terms, but does not transfer ownership of the
            underlying intellectual property.
          </p>
          <p>
            Any applications, products, or services you build using the code are
            yours.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material
            changes, we&rsquo;ll update the &ldquo;Last updated&rdquo; date at
            the top. Continued use of the product after changes constitutes
            acceptance of the new Terms.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws
            of the United States. Any disputes arising under these Terms shall be
            resolved in accordance with applicable federal and state law.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these Terms? Email us at{" "}
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
