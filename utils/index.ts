import fire from "../firebase/clientApp";


export function deleteFirebaseImages(url: string | string[]) {
    if (typeof url === "string") {
        const path = url.replace("https://ik.imagekit.io/biche", "https://firebasestorage.googleapis.com");
        fire.storage().refFromURL(path).delete();
    } else {
        url.forEach(link => {
            const path = link.replace("https://ik.imagekit.io/biche", "https://firebasestorage.googleapis.com");
            fire.storage().refFromURL(path).delete();
        })
    }
}

export function renderBlogImage(blob) {
    return URL.createObjectURL(blob);
}