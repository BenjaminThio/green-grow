/*
 * Plain shared types + constants for the AI features.
 *
 * These live OUTSIDE lib/ai.ts because that file is 'use server': a
 * "use server" module may only export async functions. A runtime value
 * like WASTE_KEYS (an array) or re-exported interfaces would trigger:
 *   "A 'use server' file can only export async functions, found object."
 * Importing types/constants from here keeps ai.ts exporting only actions.
 */

export interface PlantAnalysis {
    is_plant: boolean;
    identification?: { name: string; scientific_name: string; confidence: number };
    health_assessment?: {
        is_healthy: boolean;
        diseases: { name: string; probability: number; treatment: string }[];
    };
}

/** Every valid category key in the upcycle wasteDatabase. */
export const WASTE_KEYS = [
    'food', 'bottle', 'can', 'tin_can', 'glass', 'ceramic', 'styrofoam',
    'wood', 'carton', 'paper', 'electronic', 'device_component', 'textile',
    'hard_plastic', 'metal_utensil', 'cookware', 'food_container',
    'container', 'snack', 'plastic_cup', 'mixed_composite', 'manual_check'
] as const;

export type WasteKey = typeof WASTE_KEYS[number];

export interface WasteClassification {
    key: WasteKey;
    label: string;       // what the model saw, e.g. "AA battery"
    confidence: number;  // 0..1
}
