'use server';

const apiKey = process.env.GOOGLE_API_KEY as string;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

export const analyzePlantImage = async (base64Image: string) => {
    const payload = {
        contents: [{
            role: 'user',
            parts: [
                { text: `
                    Analyze this plant image as if you are the Plant.id API. 
                    Return ONLY a JSON object (no markdown, no code blocks) with this exact structure:
                    {
                        'is_plant': true,
                        'identification': { 'name': 'Common Name', 'scientific_name': 'Scientific Name', 'confidence': 0.95 },
                        'health_assessment': {
                            'is_healthy': boolean,
                            'diseases': [
                                { 'name': 'Disease Name', 'probability': 0.89, 'treatment': 'One concise treatment sentence.' }
                            ]
                        }
                    }
                    If it is not a plant, set 'is_plant': false.
                ` },
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
            ]
        }],
        generationConfig: { responseMimeType: 'application/json' }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(textResponse);
    } catch (error) {
        console.error('Analysis Error:', error);
        return null;
    }
};