"use client";

import { PRICING_PLANS } from "@/lib/pricing";
import { Check } from "lucide-react";

export default function Pricing() {
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
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.popular === true === true
                  ? "bg-black text-white ring-2 ring-black"
                  : "bg-white ring-1 ring-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  plan.popular === true ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-1 text-sm ${
                  plan.popular === true ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {plan.description}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span
                  className={`ml-1 ${
                    plan.popular === true ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  one-time
                </span>
              </div>

              <a
                href={plan.paymentLink}
                className={`mt-8 w-full inline-flex items-center justify-center font-medium rounded-lg transition-colors px-6 py-3 text-base no-underline ${
                  plan.popular === true
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Buy Now
              </a>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 ${
                        plan.popular === true ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.popular === true ? "text-gray-300" : "text-gray-600"
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
