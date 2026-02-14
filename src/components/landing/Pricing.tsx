"use client";

import { PLANS } from "@/lib/stripe";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { Check } from "lucide-react";

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(priceId: string) {
    if (!priceId) return; // Free plan
    setLoading(priceId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            One-time payment. Lifetime access. Free updates.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                "popular" in plan && plan.popular
                  ? "bg-black text-white ring-2 ring-black"
                  : "bg-white ring-1 ring-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  "popular" in plan && plan.popular
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-1 text-sm ${
                  "popular" in plan && plan.popular
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.price > 0 && (
                  <span
                    className={`ml-1 ${
                      "popular" in plan && plan.popular
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    one-time
                  </span>
                )}
              </div>

              <Button
                onClick={() => handleSubscribe(plan.priceId)}
                loading={loading === plan.priceId}
                variant={
                  "popular" in plan && plan.popular ? "secondary" : "primary"
                }
                size="lg"
                className="mt-8 w-full"
              >
                Buy Now
              </Button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 ${
                        "popular" in plan && plan.popular
                          ? "text-green-400"
                          : "text-green-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        "popular" in plan && plan.popular
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
