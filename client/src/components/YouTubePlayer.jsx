import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { buildEmbedUrl, getYouTubeThumbnail } from '../utils/youtube';

/**
 * YouTubePlayer — Responsive embedded YouTube player component.
 *
 * Uses youtube-nocookie.com for privacy-enhanced mode.
 * Implements a "click-to-load" poster pattern: shows the thumbnail
 * until the user clicks Play, then swaps to the iframe.
 * This avoids loading the YouTube iframe (and its tracking scripts)
 * until the user actually wants to watch.
 *
 * @param {Object}  props
 * @param {string}  props.videoId      — 11-char YouTube video ID (required)
 * @param {string}  [props.title]      — Accessible iframe title
 * @param {boolean} [props.autoplay]   — Autoplay when iframe loads (default false)
 * @param {string}  [props.className]  — Additional classes on the wrapper
 */
const YouTubePlayer = ({ videoId, title = 'Video lesson', autoplay = false, className = '' }) => {
    const [playing, setPlaying] = useState(autoplay);

    if (!videoId) return null;

    const embedUrl = buildEmbedUrl(videoId, { autoplay: true }); // always autoplay once clicked
    const thumbnail = getYouTubeThumbnail(videoId, 'maxres');
    const fallbackThumbnail = getYouTubeThumbnail(videoId, 'hq');

    return (
        <div
            className={`relative w-full aspect-video bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 group ${className}`}
        >
            {!playing ? (
                /* ── Thumbnail / Poster ─────────────────────────────────────── */
                <button
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-black focus:outline-none"
                    aria-label={`Play: ${title}`}
                >
                    {/* Thumbnail image */}
                    <img
                        src={thumbnail}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.target.src = fallbackThumbnail; }}
                        loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Play button */}
                    <div className="relative z-10 w-20 h-20 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center shadow-2xl transition-all duration-200 group-hover:scale-110 group-hover:shadow-violet-500/40">
                        <Play size={32} className="text-white ml-1" fill="currentColor" />
                    </div>
                </button>
            ) : (
                /* ── YouTube iframe ─────────────────────────────────────────── */
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src={embedUrl}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            )}
        </div>
    );
};

export default YouTubePlayer;
