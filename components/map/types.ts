export type PinKind = 'report' | 'event';
export type PinStatus = 'urgent' | 'medium' | 'healthy' | 'event';

export interface MapPin {
    /** Stable unique id — the old code keyed markers by array index. */
    id: string;
    lat: number;
    lng: number;
    /**
     * Explicit kind. The old filter inferred it from `timeline === undefined`,
     * which broke as soon as an event was given `timeline: []`.
     */
    kind: PinKind;
    status: PinStatus;
    title: string;
    description: string;
    category: string;
    date: string;
}

export type MapFilter = 'all' | 'events' | 'reports';
