'use server';

/*
 * All Gemini calls live here now (previously split across
 * app/gaia/gaia.tsx and app/my-trees/dr-green.tsx). The API key never
 * leaves the server.
 *
 * NOTE: this is a 'use server' module, so it may ONLY export async
 * functions. Types and constants (PlantAnalysis, WASTE_KEYS, etc.) live
 * in ./ai-types and are imported here.
 */

import { WASTE_KEYS } from './ai-types';
import type { PlantAnalysis, WasteClassification } from './ai-types';

const API_KEY = process.env.GOOGLE_API_KEY as string;

/*
 * Use a STABLE, generally-available model. The previous
 * 'gemini-2.5-flash-preview-09-2025' was a dated preview alias; Google
 * shuts those down, after which the endpoint 404s and every call silently
 * returned null (so Gaia/Dr. Green/Upcycle appeared to "do nothing").
 * gemini-2.5-flash is GA and supports text + vision.
 */
const MODEL = 'gemini-2.5-flash';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

interface GeminiPart {
    text?: string;
    inlineData?: { mimeType: string; data: string };
}

/** Strip a data-URL prefix and detect its mime type for the Gemini payload. */
function toInlineData(dataUrl: string): { mimeType: string; data: string } {
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]*)$/.exec(dataUrl);
    if (match) return { mimeType: match[1], data: match[2] };
    // Already raw base64, assume JPEG.
    return { mimeType: 'image/jpeg', data: dataUrl };
}

async function generate(parts: GeminiPart[], systemInstruction?: string, json = false): Promise<string | null> {
    if (!API_KEY) {
        console.error('[ai] GOOGLE_API_KEY is not set. Add it to .env.local and restart the dev server.');
        return null;
    }

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

        if (!response.ok) {
            // Surface the real reason (bad key, model 404, quota, etc.).
            const body = await response.text();
            console.error(`[ai] Gemini ${response.status} ${response.statusText}: ${body.slice(0, 500)}`);
            return null;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            console.error('[ai] Gemini returned no text:', JSON.stringify(data).slice(0, 500));
            return null;
        }
        return text;
    } catch (error) {
        console.error('[ai] Gemini request failed:', error);
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
        parts.push({ inlineData: toInlineData(imageBase64) });
    }
    return (await generate(parts, GAIA_SYSTEM)) ?? 'The forest spirits are quiet right now… please try again in a moment. 🌿';
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
        [{ text: prompt }, { inlineData: toInlineData(base64Image) }],
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

/* ============================================================
   Upcycle Smart AI — accurate waste classification via Gemini
   vision. Replaces the old MobileNet classifier, which only knew
   generic ImageNet labels (dog breeds, etc.) and guessed materials
   by keyword matching — hence the wrong results for batteries, etc.
   (WASTE_KEYS / WasteClassification live in ./ai-types.)
   ============================================================ */

export async function classifyWaste(base64Image: string): Promise<WasteClassification | null> {
    const prompt = `
You are a waste-sorting expert. Look at the image and identify the SINGLE main object.
Classify it into EXACTLY ONE of these category keys (return the key verbatim):

- food: food scraps, fruit, vegetables, organic waste
- bottle: plastic drink bottle (PET)
- can: aluminium beverage can
- tin_can: steel food tin
- glass: glass bottle or jar
- ceramic: ceramic, pottery, porcelain
- styrofoam: polystyrene foam
- wood: wood, timber, branches
- carton: drink/milk carton (Tetra Pak)
- paper: paper, cardboard, newspaper
- electronic: whole electronic device (phone, laptop, appliance)
- device_component: battery, cable, circuit board, charger, small e-waste
- textile: clothing, fabric, textiles
- hard_plastic: rigid plastic items (toys, buckets, crates, tubs)
- metal_utensil: cutlery, stainless steel utensils
- cookware: pots, pans, non-stick cookware
- food_container: takeaway box with food residue
- container: clean reusable plastic tub/container
- snack: chip bag, candy wrapper, metallized film
- plastic_cup: disposable plastic cup
- mixed_composite: an item made of several bonded materials
- manual_check: unclear or none of the above

Return ONLY a JSON object, no markdown:
{ "key": "<one key from the list>", "label": "<short name of what you see>", "confidence": <0..1> }`;

    const text = await generate(
        [{ text: prompt }, { inlineData: toInlineData(base64Image) }],
        undefined,
        true
    );
    if (!text) return null;

    try {
        const parsed = JSON.parse(text) as WasteClassification;
        // Guard against a hallucinated key.
        if (!WASTE_KEYS.includes(parsed.key)) {
            return { key: 'manual_check', label: parsed.label ?? 'Unknown item', confidence: parsed.confidence ?? 0 };
        }
        return parsed;
    } catch {
        return null;
    }
}
