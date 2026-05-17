import JsonLd from "@/components/JsonLd"
import Link from "next/link"
import { absoluteUrl } from "@/lib/site"

export const metadata = {
  title: "Pricing - Free And Pro PDF Tools",
  description:
    "Compare Free, Pro and API access plans for PDF search, highlighting, extraction, OCR, batch processing and developer API access.",
  keywords: [
    "PDF tools pricing",
    "PDF API pricing",
    "PDF OCR subscription",
    "PDF batch processing",
    "PDF tools pro plan",
  ],
  alternates: {
    canonical: "/pricing",
  },
}

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "For small PDFs and occasional document tasks.",
    cta: "Start Free",
    href: "/tools",
    features: [
      "Small PDF files",
      "Search PDF text",
      "Highlight matching text",
      "Extract matching pages",
      "PDF to Word conversion",
    ],
  },
  {
    name: "Pro",
    price: "₹99",
    period: "per month",
    description: "For larger files, heavier usage and premium PDF features.",
    cta: "Create Account",
    href: "/register",
    features: [
      "Larger PDF uploads",
      "Batch processing",
      "OCR for scanned PDFs",
      "Watermark removal",
      "Unlimited daily usage",
      "Priority processing",
    ],
  },
  {
    name: "API Access",
    price: "₹99",
    period: "per month",
    description: "For developers who want PDF search and highlight APIs.",
    cta: "View API",
    href: "/api-access",
    features: [
      "PDF Search API",
      "PDF Highlight API",
      "Extract matching pages API",
      "API key access",
      "Usage dashboard",
      "Developer documentation",
    ],
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Free PDF Tools Online Plans",
          description:
            "Free and paid PDF tools plans for larger files, batch processing, OCR and API access.",
          offers: plans.map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            price:
              plan.price === "₹0"
                ? "0"
                : plan.price.replace("₹", ""),
            priceCurrency: "INR",
            url: absoluteUrl(plan.href),
          })),
        }}
      />

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Simple PDF Tools Pricing
        </h1>

        <p className="text-zinc-400 leading-8 mt-6 max-w-3xl mx-auto">
          Keep small PDF tasks free, then upgrade for larger files, batch
          processing, OCR, watermark removal, unlimited usage and developer API
          access.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="border border-zinc-800 bg-zinc-950 rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="text-zinc-400 leading-7 mt-3">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-zinc-500 ml-2">{plan.period}</span>
              </div>

              <ul className="grid gap-3 mt-6 text-zinc-300">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="block bg-white text-black text-center font-semibold rounded-lg px-5 py-3 mt-8"
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="text-zinc-500 text-sm leading-7 mt-8">
          Payment checkout is the next integration step. Connect Razorpay or
          Stripe before enabling paid upgrades in production.
        </p>
      </section>
    </main>
  )
}
