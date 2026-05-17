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
