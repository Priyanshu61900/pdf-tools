import ExtractPagesTool from "@/components/ExtractPagesTool"

export const metadata = {
  title: "Extract Matching PDF Pages Online Free",
  description:
    "Extract PDF pages containing matching keywords and text instantly online for free.",
}

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h1 className="text-5xl font-bold">
          Extract Matching PDF Pages
        </h1>

      </section>

      <section className="flex justify-center px-6">
        <ExtractPagesTool />
      </section>

    </main>
  )
}