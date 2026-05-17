import LegalPage from "@/components/LegalPage"

export const metadata = {
  title: "Cookie Policy",
  description:
    "Cookie policy for Free PDF Tools Online, including analytics and Google AdSense advertising cookies.",
  alternates: {
    canonical: "/cookie-policy",
  },
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="May 17, 2026"
      description="This Cookie Policy explains how cookies and similar technologies may be used on Free PDF Tools Online."
      sections={[
        {
          title: "What Cookies Are",
          body: [
            "Cookies are small text files stored on your device by your browser. They help websites operate, remember preferences, measure traffic and support advertising.",
          ],
        },
        {
          title: "How We Use Cookies",
          body: [
            "We may use essential cookies for site functionality, analytics cookies to understand how visitors use the website, and advertising cookies to support ads shown on the site.",
          ],
        },
        {
          title: "Google AdSense Cookies",
          body: [
            "If Google AdSense ads are shown on this site, Google and its partners may use cookies to serve personalized or non-personalized ads, measure ad performance and prevent fraud.",
            "Google's use of advertising cookies enables it and its partners to serve ads based on visits to this site and other websites. You can manage Google ad personalization at https://adssettings.google.com/.",
          ],
        },
        {
          title: "Managing Cookies",
          body: [
            "You can block, delete or manage cookies through your browser settings. Some website features may not work correctly if cookies are disabled.",
          ],
        },
        {
          title: "Updates",
          body: [
            "We may update this Cookie Policy when our website, advertising setup or analytics tools change.",
          ],
        },
      ]}
    />
  )
}
