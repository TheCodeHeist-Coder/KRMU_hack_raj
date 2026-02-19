import fs from 'fs';

interface AIResult {
    aiIsReal?: boolean;
    aiScore?: number;
    aiDetails?: Record<string, unknown>;
}


export async function analyzeImage(filePath: string): Promise<AIResult | null> {
    try {
        const apiKey = process.env.BITMIND_API_KEY;
        if (!apiKey) {
            throw new Error('BITMIND_API_KEY is not set');
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = `data:image/${filePath.split('.').pop()};base64,${fileBuffer.toString('base64')}`;

        const response = await fetch(
            'https://api.bitmind.ai/oracle/v1/34/detect-image',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.BITMIND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: base64Image,
                    rich: true
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`BitMind API error: ${errorText}`);
        }

        const data: any = await response.json();
          
      return data;
       

    } catch (error: any) {
        console.error('BitMind analyzeImage error:', error.message);
        return null;
    }
}

export default { analyzeImage };
