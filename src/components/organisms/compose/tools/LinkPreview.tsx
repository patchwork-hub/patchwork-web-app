import { FC } from "react"
import { useLinkStore } from '../store/useLinkStore';
import { truncateLongUrls } from "@/utils/helper/helper";

export const LinkPreviewer: FC = () => {
    const { preview } = useLinkStore();

    if (!preview) return null;

    const { url, title, description, images } = preview;

    return (
        <LinkPreview url={url} title={title} description={description} image={images && images[0]?.src} />
    )
}

export const LinkPreview: FC<{
    url: string,
    title: string,
    description?: string,
    image: string;
}> = ({
    url,
    title,
    description,
    image
}) => {
        return (
            <a key={url} href={url} target="_blank" className="block mt-4 border-[0.5] border-[#96A6C2] p-2 rounded">
                {image && <img src={image} alt="preview" className="mb-2 w-full max-h-[200px] object-cover" />}
                <h1 className="text-orange-500 line-clamp-1">
                    {title}
                </h1>
                {description && <p className="line-clamp-3">{truncateLongUrls(description)}</p>}
            </a>
        )
    }