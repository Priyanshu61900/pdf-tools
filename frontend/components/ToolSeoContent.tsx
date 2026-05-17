type Faq = {
  question: string
  answer: string
}

type ToolSeoContentProps = {
  title: string
  intro: string
  steps: string[]
  uses: string[]
  tips: string[]
  faqs: Faq[]
}

export default function ToolSeoContent({
  title,
  intro,
  steps,
  uses,
  tips,
  faqs,
}: ToolSeoContentProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 grid gap-14">
      <article>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-zinc-400 leading-8 mt-5">
          {intro}
        </p>
      </article>

      <article>
        <h2 className="text-3xl font-bold">How To Use This Tool</h2>
        <ol className="grid gap-4 mt-6">
          {steps.map((step, index) => (
            <li
              key={step}
              className="border border-zinc-800 bg-zinc-950 rounded-lg p-5"
            >
              <span className="text-zinc-500 text-sm">
                Step {index + 1}
              </span>
              <p className="text-zinc-300 leading-7 mt-2">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </article>

      <article>
        <h2 className="text-3xl font-bold">Common Uses</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {uses.map((use) => (
            <p
              key={use}
              className="border border-zinc-800 bg-zinc-950 rounded-lg p-5 text-zinc-300 leading-7"
            >
              {use}
            </p>
          ))}
        </div>
      </article>

      <article>
        <h2 className="text-3xl font-bold">Helpful Tips</h2>
        <div className="grid gap-4 mt-6">
          {tips.map((tip) => (
            <p key={tip} className="text-zinc-400 leading-8">
              {tip}
            </p>
          ))}
        </div>
      </article>

      <article>
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="grid gap-6 mt-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-xl font-semibold">
                {faq.question}
              </h3>
              <p className="text-zinc-400 leading-8 mt-2">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
