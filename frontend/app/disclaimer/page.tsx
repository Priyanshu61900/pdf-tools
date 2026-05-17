import LegalPage from "@/components/LegalPage"

export const metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for Free PDF Tools Online and its PDF search, highlight, extract and conversion tools.",
  alternates: {
    canonical: "/disclaimer",
  },
}

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated="May 17, 2026"
      description="This disclaimer explains the limits of the information and tools provided by Free PDF Tools Online."
      sections={[
        {
          title: "General Information",
          body: [
            "Free PDF Tools Online provides document utilities for convenience. We do our best to make the tools useful, but we cannot guarantee that every result will be complete, accurate or suitable for your specific purpose.",
          ],
        },
        {
          title: "File Output",
          body: [
            "PDF processing can vary based on document structure, fonts, scanned images, embedded content and file permissions. You should review every downloaded output before relying on it.",
          ],
        },
        {
          title: "External Links And Ads",
          body: [
            "This website may include advertisements and links to third-party websites. We do not control the content, policies or practices of those third-party websites.",
          ],
        },
        {
          title: "User Responsibility",
          body: [
            "You are responsible for deciding whether this service is appropriate for your files and for keeping your own backups of important documents.",
          ],
        },
      ]}
    />
  )
}
