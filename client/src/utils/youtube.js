/**
 * youtube.js — Client-side YouTube utilities
 *
 * Mirror of server/utils/youtube.js for use in React components.
 * Must stay in sync with the server version.
 *
 * Supported URL formats:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://youtube.com/embed/VIDEO_ID
 *   https://www.youtube-nocookie.com/embed/VIDEO_ID
 */

/**
 * Extracts a YouTube video ID from any supported URL format.
 * Returns the 11-character video ID, or null if invalid.
 *
 * @param {string} url
 * @returns {string|null}
 */
export const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;

    const ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

    try {
        const parsed = new URL(url.trim());
        const host = parsed.hostname.replace(/^www\./, '');

        // youtube.com/watch?v=ID
        if (host === 'youtube.com' && parsed.pathname === '/watch') {
            const id = parsed.searchParams.get('v');
            return id && ID_PATTERN.test(id) ? id : null;
        }

        // youtube.com/embed/ID  or  youtube-nocookie.com/embed/ID
        if (
            (host === 'youtube.com' || host === 'youtube-nocookie.com') &&
            parsed.pathname.startsWith('/embed/')
        ) {
            const id = parsed.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0];
            return id && ID_PATTERN.test(id) ? id : null;
        }

        // youtu.be/ID
        if (host === 'youtu.be') {
            const id = parsed.pathname.slice(1).split('/')[0].split('?')[0];
            return id && ID_PATTERN.test(id) ? id : null;
        }
    } catch {
        return null;
    }

    return null;
};

/**
 * Returns true if the URL is a valid, parseable YouTube video link.
 *
 * @param {string} url
 * @returns {boolean}
 */
export const isValidYouTubeUrl = (url) => extractYouTubeId(url) !== null;

/**
 * Returns the HD thumbnail URL for a given YouTube video ID.
 * Falls back through quality levels if hqdefault is missing.
 *
 * Quality levels (in order):
 *   maxresdefault  — 1280×720 (not always available)
 *   hqdefault      — 480×360  (almost always available)
 *   mqdefault      — 320×180
 *   default        — 120×90
 *
 * @param {string} videoId
 * @param {'maxres'|'hq'|'mq'|'default'} [quality='hq']
 * @returns {string}
 */
export const getYouTubeThumbnail = (videoId, quality = 'hq') => {
    if (!videoId) return '';
    const qualityMap = {
        maxres: 'maxresdefault',
        hq:     'hqdefault',
        mq:     'mqdefault',
        default: 'default',
    };
    const q = qualityMap[quality] || 'hqdefault';
    return `https://img.youtube.com/vi/${videoId}/${q}.jpg`;
};

/**
 * Builds a canonical youtube-nocookie.com embed URL (privacy-enhanced mode).
 *
 * @param {string} videoId
 * @param {Object} [options]
 * @param {boolean} [options.autoplay=false]
 * @returns {string}
 */
export const buildEmbedUrl = (videoId, { autoplay = false } = {}) => {
    if (!videoId) return '';
    const params = new URLSearchParams({
        autoplay:       autoplay ? '1' : '0',
        modestbranding: '1',
        rel:            '0',   // no related videos at end
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
};
