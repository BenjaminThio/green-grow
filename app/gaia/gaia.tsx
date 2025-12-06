'use server';

const apiKey = process.env.GOOGLE_API_KEY as string;

export const callGemini = async (prompt: string, imageBase64: string | null = null) => {
    const model = imageBase64 ? 'gemini-2.5-flash-preview-09-2025' : 'gemini-2.5-flash-preview-09-2025';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = `
        You are Gaia, a nature spirit AI for a 'Go Green' application. 
        Your goal is to help users identify plants, diagnose plant health issues, suggest recycling methods, and give eco-friendly advice.
        
        Style Guide:
        - Tone: Soothing, encouraging, wise, and slightly magical.
        - Emoji usage: Frequent but tasteful (🌿, 🌱, 🌍, 💧).
        - If an image is provided:
           1. Identify the plant or object.
           2. If it's a plant, check for visible diseases/issues and suggest care.
           3. If it's trash/object, explain how to recycle or upcycle it.
        - Keep responses concise (under 150 words) unless asked for details.
    `;

    const contents = [];
    
    const parts = [{ text: prompt }];
    if (imageBase64) {
        const base64Data = imageBase64.split(',')[1];

        parts.push({
            inlineData: {
                mimeType: 'image/png',
                data: base64Data
            }
        } as any);
    }

    contents.push({ role: 'user', parts });

    const payload = {
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting to the earth's network right now. 🌱";
    } catch (error) {
        console.error(error);
        return 'I felt a disturbance in the connection. Please try again. 🍃';
    }
};