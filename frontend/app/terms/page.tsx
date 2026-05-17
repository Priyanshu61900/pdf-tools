import LegalPage from "@/components/LegalPage"

export const metadata = {
  title: "Terms of Use",
  description:
    "Terms of use for Free PDF Tools Online and its PDF processing tools.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="May 17, 2026"
      description="These Terms explain the rules for using Free PDF Tools Online. By using this website, you agree to use the tools responsibly and lawfully."
      sections={[
        {
          title: "Use Of The Website",
          body: [
            "You may use our PDF tools for personal, educational or business purposes as long as your use complies with applicable laws and these Terms.",
            "You are responsible for the files you upload and for making sure you have the right to process, modify, convert or download those documents.",
          ],
        },
        {
          title: "Prohibited Use",
          body: [
            "You must not use this website to upload malware, unlawful content, stolen documents, confidential files you are not authorized to process, or content that infringes another person's rights.",
            "You must not attempt to overload, disrupt, reverse engineer, scrape abusively or interfere with the website or its infrastructure.",
          ],
        },
        {
          title: "No Professional Advice",
          body: [
            "The tools are provided for document utility purposes only. We do not provide legal, financial, compliance, security or professional advice.",
          ],
        },
        {
          title: "Free And Paid Plans",
          body: [
            "Small PDF tasks may be offered for free. Larger files, batch processing, OCR, watermark removal, unlimited usage and similar premium features may require a paid plan.",
            "Paid features, prices and limits may change over time. If checkout is enabled, the price and billing period shown at checkout will control your purchase.",
          ],
        },
        {
          title: "Developer API Access",
          body: [
            "API access is intended for developers who want to process PDFs programmatically. You are responsible for securing your API keys and for all activity under your account.",
            "We may apply request limits, usage rules, abuse prevention checks and billing requirements to API access.",
          ],
        },
        {
          title: "Affiliate Recommendations",
          body: [
            "The website may recommend third-party PDF editors, hosting services, AI tools, resume builders and office tools. Some recommendations may include affiliate links.",
            "Third-party products are not controlled by us. You should review each provider's terms, pricing and privacy policy before purchasing.",
          ],
        },
        {
          title: "Availability",
          body: [
            "We try to keep the site available, but we do not guarantee uninterrupted access, error-free processing or permanent storage of uploaded or generated files.",
            "Features may change, break, be removed or become unavailable without notice.",
          ],
        },
        {
          title: "Intellectual Property",
          body: [
            "You keep your rights in the files you upload. The website name, layout, text and software are owned by Free PDF Tools Online or its respective licensors.",
          ],
        },
        {
          title: "Limitation Of Liability",
          body: [
            "The website is provided as is. To the maximum extent allowed by law, we are not liable for lost files, inaccurate output, service downtime, data loss or damages resulting from your use of the site.",
          ],
        },
      ]}
    />
  )
}
