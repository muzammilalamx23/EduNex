/**
 * youtube.js — Server-side YouTube utilities
 *
 * Handles extraction and validation of YouTube video IDs.
 * Used by the course route validator to reject non-YouTube URLs
 * and to pre-compute the videoId before saving to MongoDB.
 *
 * Supported formats:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://www.youtube.com/watch?v=VIDEO_ID&t=30s
 *   https://youtu.be/VIDEO_ID
 *   https://youtu.be/VIDEO_ID?t=30
 *   https://youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID?start=30
 *   https://www.youtube-nocookie.com/embed/VIDEO_ID
 */

/**
 * Extracts a YouTube video ID from any supported URL format.
 * Returns the 11-character video ID string, or null if not a valid YouTube URL.
 *
 * @param {string} url
 * @returns {string|null}
 */
const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;

    // YouTube video IDs are always exactly 11 characters
    // consisting of alphanumerics, hyphens, and underscores.
    const ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

    try {
        const parsed = new URL(url.trim());
        const host = parsed.hostname.replace(/^www\./, '');

        // ── youtube.com/watch?v=ID ────────────────────────────────────────────
        if (host === 'youtube.com' && parsed.pathname === '/watch') {
            const id = parsed.searchParams.get('v');
            return id && ID_PATTERN.test(id) ? id : null;
        }

        // ── youtube.com/embed/ID or youtube-nocookie.com/embed/ID ─────────────
        if (
            (host === 'youtube.com' || host === 'youtube-nocookie.com') &&
            parsed.pathname.startsWith('/embed/')
        ) {
            const id = parsed.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0];
            return id && ID_PATTERN.test(id) ? id : null;
        }

        // ── youtu.be/ID ───────────────────────────────────────────────────────
        if (host === 'youtu.be') {
            const id = parsed.pathname.slice(1).split('/')[0].split('?')[0];
            return id && ID_PATTERN.test(id) ? id : null;
        }
    } catch {
        // URL constructor throws on invalid URLs — not a YouTube link
        return null;
    }

    return null;
};

/**
 * Returns true if the URL is a valid YouTube video link with an extractable ID.
 *
 * @param {string} url
 * @returns {boolean}
 */
const isValidYouTubeUrl = (url) => extractYouTubeId(url) !== null;

/**
 * Builds the canonical embed URL for a given video ID.
 *
 * @param {string} videoId
 * @param {Object} [options]
 * @param {boolean} [options.autoplay=false]
 * @param {boolean} [options.modestBranding=true]
 * @param {boolean} [options.rel=false]           - Disable related videos
 * @returns {string}
 */
const buildEmbedUrl = (videoId, options = {}) => {
    const {
        autoplay = false,
        modestBranding = true,
        rel = false,
    } = options;

    const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        modestbranding: modestBranding ? '1' : '0',
        rel: rel ? '1' : '0',
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

module.exports = { extractYouTubeId, isValidYouTubeUrl, buildEmbedUrl };
