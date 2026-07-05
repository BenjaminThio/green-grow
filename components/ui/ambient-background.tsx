/*
 * Server component — pure markup, zero JS shipped.
 * Rendered ONCE per layout instead of being duplicated (with its CSS)
 * inside every single page.
 */
export default function AmbientBackground() {
    return (
        <div className="ambient-bg" aria-hidden="true">
            <div className="gradient-blob blob-1" />
            <div className="gradient-blob blob-2" />
        </div>
    );
}
