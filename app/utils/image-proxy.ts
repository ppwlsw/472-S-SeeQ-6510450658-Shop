
export async function prefetchImage(image_url: string) {
    const response =  await fetch(image_url);
    const data = await response.blob();
    const buff = Buffer.from(await data.arrayBuffer())
    return "data:" + data.type + ";base64," + buff.toString("base64");
}