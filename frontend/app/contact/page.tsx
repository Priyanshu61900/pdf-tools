export const metadata = {
  title: "Contact",
  description:
    "Contact OmniToolbox for feedback, support, privacy requests and website questions.",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold">
          Contact
        </h1>

        <p className="text-zinc-400 leading-8 mt-6">
          For support, feedback, privacy requests or questions about Free PDF
          Tools Online, contact us by email.
        </p>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold">Email</h2>
          <a
            href="mailto:support@omnitoolbox.in"
            className="text-zinc-300 underline mt-4 inline-block"
          >
            support@omnitoolbox.in
          </a>
        </div>

        <p className="text-zinc-500 text-sm leading-7 mt-6">
          Replace this email with your real support email before submitting the
          site for AdSense review.
        </p>
      </section>
    </main>
  )
}
