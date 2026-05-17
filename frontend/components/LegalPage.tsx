type Section = {
  title: string
  body: string[]
}

type LegalPageProps = {
  title: string
  description: string
  updated: string
  sections: Section[]
}

export default function LegalPage({
  title,
  description,
  updated,
  sections,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-zinc-400 text-sm">Last updated: {updated}</p>

        <h1 className="text-4xl md:text-5xl font-bold mt-4">
          {title}
        </h1>

        <p className="text-zinc-400 leading-8 mt-6">
          {description}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20 grid gap-10">
        {sections.map((section) => (
          <article key={section.title}>
            <h2 className="text-2xl font-bold">
              {section.title}
            </h2>

            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-zinc-400 leading-8 mt-4"
              >
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </section>
    </main>
  )
}
