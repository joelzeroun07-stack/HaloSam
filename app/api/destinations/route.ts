import { NextRequest, NextResponse } from 'next/server'
import { destinations } from '@/lib/data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'rating'

  let result = [...destinations]

  if (category && category !== 'semua') {
    result = result.filter((d) => d.category === category)
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
  if (sort === 'crowd') {
    const order = { low: 0, medium: 1, high: 2 }
    result.sort((a, b) => order[a.crowdLevel] - order[b.crowdLevel])
  }

  return NextResponse.json({ data: result, total: result.length })
}
