import { LinkPreview } from "@/components/organisms/compose/types";
import { CHANNEL_ORG_INSTANCE } from "@/utils/constant";
import axios from "axios";

export const fetchLinkPreview = async (url: string, onError: () => void) => {
    try {
        const response = await axios.get<LinkPreview>(
            `${CHANNEL_ORG_INSTANCE}/api/v1/utilities/link_preview`,
            {
                params: { url },
            },
        );
        return response.data;
    } catch (error) {
        onError();
        console.error('Failed to fetch preview', error);
        return;
    }
}