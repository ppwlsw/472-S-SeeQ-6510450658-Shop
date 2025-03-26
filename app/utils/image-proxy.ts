
export async function prefetchImage(image_url: string) {
    if (!image_url) {
        return "/default_img.jpg"
    }
    const regex = new RegExp("^(?!.*placeholder)https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(\/\S*)?$");
    if (!regex.test(image_url)) {
        return "/default_img.jpg";
    }
    const response =  await fetch(image_url);
    const data = await response.blob();
    const buff = Buffer.from(await data.arrayBuffer())
    return "data:" + data.type + ";base64," + buff.toString("base64");
}