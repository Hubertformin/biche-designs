export interface BlogPostModel {
    id?: string;
    title?: string;
    coverImageURL?: string;
    content?: string;
    thumbnails?: {
        small?: string;
        medium?: string;
        large?: string;
    },
    dateAdded?: Date;
}