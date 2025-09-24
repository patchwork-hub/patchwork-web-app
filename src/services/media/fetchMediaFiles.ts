import { Media } from "@/types/status";

export async function fetchMediaFiles(mediaAttachments: Media[]) {
    const files = await Promise.all(mediaAttachments.map(async (media) => {
        const file = await fetchFile(media.preview_url);
        return file;
    }));
    return files;
}

export async function fetchFile(url: string) {
    const response = await fetch(`/api/images?url=${encodeURIComponent(url)}`);
    const blob = await response.blob();
    return new File([blob], url.split('/').pop() || 'file', { type: blob.type });
}