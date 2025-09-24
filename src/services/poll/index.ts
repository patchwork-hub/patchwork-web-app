import http from "@/lib/http";
import { Poll } from "@/types/status";

export const votePoll = async ({ id, choices }: {
    id: string;
    choices: number[];
}): Promise<Poll> => {
    const url = `/api/v1/polls/${id}/votes`;

    const formData = new FormData();
    choices.forEach(choice => {
        formData.append('choices[]', choice.toString());
    });

    const response = await http.post(url, formData);

    return response.data;
}

export const getPoll = async (id: string) => {
    const response = await http.get<Poll>(`/api/v1/polls/${id}`);
    return response.data;
}