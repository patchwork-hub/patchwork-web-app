export interface GifvResponse {
    locale:  string;
    results: Result[];
    next:    string;
}

export interface Result {
    id:                         string;
    title:                      string;
    media_formats:              MediaFormats;
    created:                    number;
    content_description:        string;
    itemurl:                    string;
    url:                        string;
    tags:                       string[];
    flags:                      string[];
    hasaudio:                   boolean;
    content_description_source: ContentDescriptionSource;
}

export enum ContentDescriptionSource {
    GenerativeAI = "GENERATIVE_AI",
}

export interface MediaFormats {
    tinygifpreview: GIF;
    gif:            GIF;
    gifpreview:     GIF;
    mp4:            GIF;
    tinygif:        GIF;
}

export interface GIF {
    url:      string;
    duration: number;
    preview:  string;
    dims:     number[];
    size:     number;
}
