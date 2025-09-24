import linkifyIt from 'linkify-it';
import { LinkPreview } from '../types';
import { fetchLinkPreview } from '@/services/status/fetchLinkPreview';

const linkify = new linkifyIt();

export const extractLinkPreview = async (text: string, setPreview: (preview: LinkPreview | undefined) => void) => {
    const links = linkify.match(text) || [];
    const urls = links.map(link => link.url);
    if (urls.length > 0) {
        try {
            const preview = await fetchLinkPreview(urls[0], () => setPreview(undefined));
            if (preview && preview.title) setPreview(preview);
        } catch (error) {
            console.error('Failed to fetch preview', error);
        }
    } else {
        setPreview(undefined);
    }
};
