"use client";
import Image from "next/image";

const FALLBACK = "/cover-fallback.svg";

// next/image only accepts a string src. Covers coming back from the API can be
// missing, empty, or an object (a File/FormData value that got JSON-serialized),
// which makes `src || FALLBACK` pass the object through and throw
// `Image is missing required "src" property: {}`. Coerce anything unusable to the fallback.
function coverSrc(src) {
    if (typeof src === "string" && src.trim())
        return src.trim();
    if (src && typeof src === "object") {
        for (const key of ["url", "src", "href"]) {
            const value = src[key];
            if (typeof value === "string" && value.trim())
                return value.trim();
        }
    }
    return FALLBACK;
}

// Book cover with a designed fallback — a missing/removed image never shows a broken icon.
export default function CoverImage({ src, alt = "", className = "", width = 400, height = 533, sizes }) {
    return (
        <Image
            src={coverSrc(src)}
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
