import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://www.brainyquote.com/quote_of_the_day', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch from BrainyQuote');
    
    const html = await res.text();
    // Use regex to locate og:description
    const match = html.match(/meta property="og:description" content="([^"]+)"/);
    if (match && match[1]) {
      const parts = match[1].split(' - ');
      const author = parts.pop()?.trim() || 'Unknown';
      const text = parts.join(' - ').trim();
      
      // Auto-assign image based on author name replacing spaces with +
      const imgSearchQuery = encodeURIComponent(author);
      // We use Wikipedia for portraits, or reliable image placeholders.
      // Easiest reliable dynamic image is Unsplash via source.unsplash.com with keywords, but it's deprecated.
      // We will construct a dummy wikipedia thumbnail search URL if available or use loremflickr:
      const imageUrl = `https://loremflickr.com/400/300/${imgSearchQuery},portrait`;

      return NextResponse.json({ 
        quote: match[1], 
        text,
        author,
        imageUrl 
      });
    }

    throw new Error('Could not parse quote from HTML');
  } catch (error) {
    console.error(error);
    // Fallback if scraping fails
    return NextResponse.json({ 
      quote: "The best way to predict the future is to invent it. - Alan Kay",
      text: "The best way to predict the future is to invent it.",
      author: "Alan Kay",
      imageUrl: "https://loremflickr.com/400/300/alan+kay,portrait"
    });
  }
}
