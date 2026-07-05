'use server';

/*
 * All Gemini calls live here now (previously split across
 * app/gaia/gaia.tsx and app/my-trees/dr-green.tsx). The API key never
 * leaves the server.
 */

const API_KEY = process.env.GOOGLE_API_KEY as string;
const MODEL = 'gemini-2.5-flash-preview-09-2025';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

interface GeminiPart {
    text?: string;
    inlineData?: { mimeType: string; data: string };
}

async function generate(parts: GeminiPart[], systemInstruction?: string, json = false): Promise<string | null> {
    const payload: Record<string, unknown> = {
        contents: [{ role: 'user', parts }],
        ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
        ...(json ? { generationConfig: { responseMimeType: 'application/json' } } : {})
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } catch (error) {
        console.error('Gemini request failed:', error);
        return null;
    }
}

const GAIA_SYSTEM = `
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

export async function askGaia(prompt: string, imageBase64: string | null = null): Promise<string> {
    const parts: GeminiPart[] = [{ text: prompt }];
    if (imageBase64) {
        parts.push({ inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] ?? imageBase64 } });
    }
    return (await generate(parts, GAIA_SYSTEM)) ?? 'The forest spirits are quiet right now… please try again in a moment. 🌿';
}

export interface PlantAnalysis {
    is_plant: boolean;
    identification?: { name: string; scientific_name: string; confidence: number };
    health_assessment?: {
        is_healthy: boolean;
        diseases: { name: string; probability: number; treatment: string }[];
    };
}

export async function analyzePlantImage(base64Image: string): Promise<PlantAnalysis | null> {
    const prompt = `
Analyze this plant image. Return ONLY a JSON object (no markdown, no code blocks) with this exact structure:
{
    "is_plant": true,
    "identification": { "name": "Common Name", "scientific_name": "Scientific Name", "confidence": 0.95 },
    "health_assessment": {
        "is_healthy": true,
        "diseases": [
            { "name": "Disease Name", "probability": 0.89, "treatment": "One concise treatment sentence." }
        ]
    }
}
If it is not a plant, set "is_plant": false.`;

    const text = await generate(
        [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] ?? base64Image } }],
        undefined,
        true
    );

    if (!text) return null;
    try {
        return JSON.parse(text) as PlantAnalysis;
    } catch {
        return null;
    }
}
