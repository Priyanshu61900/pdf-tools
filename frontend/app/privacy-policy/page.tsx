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
            "We do not ask you to create an account, and we do not intentionally collect sensitive personal information. Your PDF may contain personal data if you choose to upload it, so you should only upload files you have the right to process.",
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
          title: "Cookies And Advertising",
          body: [
            "We may use cookies and similar technologies to operate the site, remember preferences, measure traffic and support advertising.",
            "This site may display ads served by Google AdSense or other advertising partners. Google may use cookies, including the DoubleClick cookie, to serve ads based on your visits to this and other websites.",
            "You can learn more about how Google uses data from partner sites at https://policies.google.com/technologies/partner-sites and manage ad personalization at https://adssettings.google.com/.",
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
