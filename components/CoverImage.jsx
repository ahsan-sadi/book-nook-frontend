"use client";
import Image from "next/image";

const FALLBACK = "/cover-fallback.svg";

// Book cover with a designed fallback — a missing/removed image never shows a broken icon.
export default function CoverImage({ src, alt = "", className = "", width = 400, height = 533, sizes }) {
    return (
        <Image
            src={src || FALLBACK}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className={className}
            onError={(e) => {
                const el = e.currentTarget;
                if (!el.src.endsWith("cover-fallback.svg"))
                    el.src = FALLBACK;
            }}
        />
    );
}
