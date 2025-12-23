import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { parse } from 'https://deno.land/x/html_parser@v0.1.3/mod.ts'

interface Metadata {
  title: string
  description: string
  image: string
}

serve(async (req) => {
  try {
    const { url } = await req.json()
    
    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetadataBot/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()
    const doc = parse(html)
    
    const metadata: Metadata = {
      title: '',
      description: '',
      image: ''
    }

    // Extract metadata
    const metaTags = doc.querySelectorAll('meta')
    metaTags.forEach((tag) => {
      const property = tag.getAttribute('property')?.toLowerCase()
      const name = tag.getAttribute('name')?.toLowerCase()
      const content = tag.getAttribute('content')

      if (!content) return

      if (property === 'og:title' || name === 'twitter:title') {
        metadata.title = content
      } else if (property === 'og:description' || name === 'twitter:description' || name === 'description') {
        metadata.description = content
      } else if (property === 'og:image' || name === 'twitter:image') {
        metadata.image = content
      }
    })

    // Fallback to title tag if no OG title
    if (!metadata.title) {
      const titleTag = doc.querySelector('title')
      if (titleTag) {
        metadata.title = titleTag.innerText
      }
    }

    return new Response(
      JSON.stringify(metadata),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch metadata' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})