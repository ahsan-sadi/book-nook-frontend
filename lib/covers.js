// Book covers are processed in the browser (resize + compress) and stored with the book,
// so adding a cover needs no upload service or API key.

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("That image couldn't be read."));
        img.src = src;
    });
}

export async function fileToCover(file, { maxWidth = 640, maxHeight = 854, quality = 0.78 } = {}) {
    if (!file)
        return "";
    const url = URL.createObjectURL(file);
    try {
        const img = await loadImage(url);
        const scale = Math.min(1, maxWidth / Math.max(img.naturalWidth, 1), maxHeight / Math.max(img.naturalHeight, 1));
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f7f6f1";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (!dataUrl.startsWith("data:image/jpeg"))
            throw new Error("That image couldn't be processed.");
        return dataUrl;
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
