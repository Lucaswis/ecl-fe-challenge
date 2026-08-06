import { getAssetsWithSeverity } from "@/lib/assets/get-assets-with-severity"

export async function GET() {
  try {
    return Response.json(await getAssetsWithSeverity())
  } catch {
    return Response.json({ error: "Upstream asset service unavailable" }, { status: 502 })
  }
}
