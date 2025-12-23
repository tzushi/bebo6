import { supabase } from '../config/supabase'

const CORS_PROXY = 'https://corsproxy.io/?'

export async function fetchUrlMetadata(url) {
  try {
    if (!url || !url.startsWith('http')) {
      console.log('Invalid URL format:', url)
      return null
    }

    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    })

    if (!response.ok) {
      console.log(`Failed to fetch URL (${response.status}):`, url)
      return null
    }

    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    const metadata = {
      title: '',
      description: '',
      image: '',
      url: url
    }

    // Extract metadata using standard meta tags
    metadata.title = 
      doc.querySelector('meta[property="og:title"]')?.content ||
      doc.querySelector('meta[name="twitter:title"]')?.content ||
      doc.querySelector('title')?.textContent?.trim() ||
      ''

    metadata.description = 
      doc.querySelector('meta[property="og:description"]')?.content ||
      doc.querySelector('meta[name="twitter:description"]')?.content ||
      doc.querySelector('meta[name="description"]')?.content ||
      ''

    metadata.image = 
      doc.querySelector('meta[property="og:image"]')?.content ||
      doc.querySelector('meta[name="twitter:image"]')?.content ||
      ''

    // Only return metadata if we have at least a title
    if (!metadata.title) {
      console.log('No metadata found for URL:', url)
      return null
    }

    return metadata
  } catch (error) {
    // Log error details but don't throw
    console.log('Error fetching metadata for URL:', url, error)
    return null
  }
}