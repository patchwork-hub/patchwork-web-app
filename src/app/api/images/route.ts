export async function GET(req: Request) {
    // Get search params from the URL
    const url = new URL(req.url).searchParams.get('url');

    // Input validation
    if (!url || typeof url !== 'string') {
        return new Response(
            JSON.stringify({ error: 'Invalid or missing URL parameter' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    try {
        // Fetch the content from the provided URL
        const response = await fetch(url);
        
        // Check if fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        
        // Return the fetched content with appropriate content type
        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'application/octet-stream'
            }
        });
    } catch (error) {
        // Error handling
        return new Response(
            JSON.stringify({ 
                error: 'Failed to fetch content', 
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}