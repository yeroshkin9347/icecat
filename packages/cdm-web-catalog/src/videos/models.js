export const defaultFilters = {
    type: 'image',
}

export const VIDEO_FILE_TYPES_ACCEPTED = [
    "video/mp4",
    "video/mp4",
    "video/x-msvideo",
    "video/xvid",
    "video/mpeg",
    "video/avi",
    "video/x-ms-wmv",
    "application/x-cdlink",
    "video/dvd",
    "video/quicktime",
];

export const IMAGE_FILE_TYPES_ACCEPTED = [
    "image/JPEG",
    "image/jpeg",
    "image/BMP",
    "image/bmp",
    "image/GIF",
    "image/gif",
    "image/PNG",
    "image/png",
    "image/TIFF",
    "image/tiff",
    "image/HEIC",
    "image/heic",
    "image/WEBP",
    "image/webp"
];

export const DOCUMENT_FILE_TYPES_ACCEPTED = [
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
    "text/html",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

export const ACCEPTABLE_FILE_TYPES = {
    video: VIDEO_FILE_TYPES_ACCEPTED,
    image: IMAGE_FILE_TYPES_ACCEPTED,
    document: DOCUMENT_FILE_TYPES_ACCEPTED,
};
