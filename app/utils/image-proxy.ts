
export async function prefetchImage(image_url: string) {
    await fetch(image_url);
}