import Link from "next/link"

type ToolGateMessageProps = {
  code?: string
}

export default function ToolGateMessage({ code }: ToolGateMessageProps) {
  if (!code) {
    return (
      <p className="text-zinc-500 text-sm leading-7 mt-4 text-center">
        Sign up is required to use this tool. Free accounts can process PDFs up
        to 5 pages.
      </p>
    )
  }

  if (code === "SIGNUP_REQUIRED") {
    return (
      <div className="border border-zinc-800 bg-black rounded-lg p-4 mt-4 text-center">
        <p className="text-zinc-300 leading-7">
          Create a free account to use this PDF tool.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Link
            href="/register"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="border border-zinc-700 px-4 py-2 rounded-lg"
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  if (code === "UPGRADE_REQUIRED" || code === "REPEAT_DOCUMENT") {
    return (
      <div className="border border-yellow-700 bg-yellow-950 text-yellow-100 rounded-lg p-4 mt-4 text-center">
        <p className="leading-7">
          Premium unlocks larger PDFs and repeat processing for Rs. 99.
        </p>
        <Link
          href="/pricing"
          className="inline-block bg-white text-black px-4 py-2 rounded-lg font-semibold mt-4"
        >
          Upgrade To Premium
        </Link>
      </div>
    )
  }

  return null
}
