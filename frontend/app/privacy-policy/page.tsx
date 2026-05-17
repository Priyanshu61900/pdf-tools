import LegalPage from "@/components/LegalPage"

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Free PDF Tools Online, including PDF processing, cookies, analytics and Google AdSense information.",
  alternates: {
    canonical: "/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 17, 2026"
      description="This Privacy Policy explains how Free PDF Tools Online handles information when you use our PDF search, highlight, extract and conversion tools."
      sections={[
        {
          title: "Information We Process",
          body: [
            "When you upload a PDF, the file is sent to our server only so the selected tool can process it. We use the uploaded file to search text, add highlights, extract matching pages or convert the document, depending on the tool you choose.",
            "You need an account to process PDF files. We do not intentionally collect sensitive personal information beyond what is needed for account access, file processing, abuse prevention and service operation. Your PDF may contain personal data if you choose to upload it, so you should only upload files you have the right to process.",
          ],
        },
        {
          title: "PDF File Handling",
          body: [
            "Processed files are used to generate downloadable results. We aim to keep uploaded and generated files only for the time needed to provide the tool output and maintain service reliability.",
            "Do not upload confidential, illegal, copyrighted or highly sensitive documents unless you have permission and understand the risks of using an online processing tool.",
          ],
        },
        {
          title: "Accounts And Sign-In Providers",
          body: [
            "If you choose to log in or register with Google or GitHub, we may receive basic profile information such as your name, email address and profile image. If you use email sign-in, we process the email address and name you provide.",
            "This information is used to create your account session, enforce free usage limits, detect repeated processing of the same PDF, and manage access to Premium tools or API features.",
          ],
        },
        {
          title: "Cookies And Advertising",
          body: [
            "We may use cookies and similar technologies to operate the site, remember preferences, measure traffic and support advertising.",
            "This site may display ads served by Google AdSense or other advertising partners. Google may use cookies, including the DoubleClick cookie, to serve ads based on your visits to this and other websites.",
            "You can learn more about how Google uses data from partner sites at https://policies.google.com/technologies/partner-sites and manage ad personalization at https://adssettings.google.com/.",
          ],
        },
        {
          title: "Payments, API Access And Affiliate Links",
          body: [
            "If paid plans, API access or subscriptions are enabled, payment processors may collect billing details needed to complete transactions. We do not intentionally store full card details on our own servers.",
            "Some resource or recommendation pages may include affiliate links. If you click an affiliate link or purchase through a partner, the partner may process information according to its own policies.",
          ],
        },
        {
          title: "Analytics And Logs",
          body: [
            "Our hosting providers and analytics tools may collect basic technical information such as IP address, browser type, device type, referring pages, pages visited and timestamps.",
            "We use this information to monitor performance, improve the website, prevent abuse and troubleshoot errors.",
          ],
        },
        {
          title: "Third-Party Services",
          body: [
            "We may rely on third-party providers for hosting, file processing, analytics, security and advertising. These providers process information according to their own privacy policies and service terms.",
            "We are not responsible for the privacy practices of external websites linked from this site.",
          ],
        },
        {
          title: "Your Choices",
          body: [
            "You can disable cookies in your browser settings, use browser privacy controls, avoid uploading files that contain personal data, or stop using the service if you do not agree with this policy.",
            "For privacy questions or removal requests, contact us through the Contact page.",
          ],
        },
        {
          title: "Policy Updates",
          body: [
            "We may update this Privacy Policy from time to time. The updated date on this page shows when the latest version was published.",
          ],
        },
      ]}
    />
  )
}
