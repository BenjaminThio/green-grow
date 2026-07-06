/*
 * Tiny CSV helper (client-safe, no deps). Properly escapes fields so
 * commas, quotes, and newlines inside values don't break the columns.
 */

function escapeCell(value: unknown): string {
    const s = value === null || value === undefined ? '' : String(value);
    // Quote if the value contains a comma, quote, or newline; double inner quotes.
    if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}

/** Build a CSV string from headers + rows (rows are arrays of cell values). */
export function toCSV(headers: string[], rows: unknown[][]): string {
    const lines = [headers.map(escapeCell).join(',')];
    for (const row of rows) {
        lines.push(row.map(escapeCell).join(','));
    }
    // Prepend a UTF-8 BOM so Excel opens accented characters correctly.
    return '\uFEFF' + lines.join('\r\n');
}

/** Trigger a browser download of the given text as a file. */
export function downloadCSV(filename: string, csv: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
