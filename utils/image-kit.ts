import ImageKit from "imagekit-javascript";

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: "https://ik.imagekit.io/biche",
    // authenticationEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/imagekit-auth`
});

export function imageKitTransformUrl({url, height, width}) {
    return imageKit.url({
        src: url,
        transformation: [{ height, width}],
        transformationPosition: "query"
    })
}

export function transformImageURL(url: string, height: number, width: number) {
    return url.substring(0, 29) + `tr:w-${width},h-${height}/` + url.substring(29);;
}
