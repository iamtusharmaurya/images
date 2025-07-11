import { type NextRequest, NextResponse } from "next/server"

/**
 * GET /api/images/search?q=<keyword>
 * Proxies the request to Unsplash so the browser never sees your secret key.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q) {
    return NextResponse.json({ error: "Missing search term" }, { status: 400 })
  }

  const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
  if (!ACCESS_KEY) {
    return NextResponse.json({ error: "Unsplash key not configured on server" }, { status: 500 })
  }

  const url =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}` + `&per_page=12&orientation=squarish`

  const unsplashRes = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  })

  const data = await unsplashRes.json()
  return NextResponse.json(data, { status: unsplashRes.status })
}
