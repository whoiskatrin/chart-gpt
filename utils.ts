export const sanitizeURL = (url: string) => {
    if (url.startsWith("http")) {
        return url;
    } else {
        return `https://${url}`;
    }
}