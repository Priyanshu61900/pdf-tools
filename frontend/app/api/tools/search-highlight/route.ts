import { proxyToolRequest } from "@/lib/toolProxy"

export async function POST(request: Request) {
  return proxyToolRequest(request, "/api/search-highlight")
}
