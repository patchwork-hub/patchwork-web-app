import http from "@/lib/http"
import { DraftComposeFormData, DraftStatusItem, DraftStatusesResponse } from "@/types/draft";

export const getDrafts = async () => {
    const response = await http.get<DraftStatusesResponse>('/api/v1/drafted_statuses');
    return response.data;
}

export const getDraft = async (id: string) => {
    const response = await http.get<DraftStatusItem>(`/api/v1/drafted_statuses/${id}`);
    return response.data;
}

export const createDraft = async (data: DraftComposeFormData) => {
    const response = await http.post<DraftStatusItem>('/api/v1/drafted_statuses', data);
    return response.data;
}

export const updateDraft = async ({ id, data }: { id: string, data: DraftComposeFormData }) => {
    const response = await http.put<DraftStatusItem>(`/api/v1/drafted_statuses/${id}`, data);
    return response.data;
}

export const deleteDraft = async (id: string) => {
    const response = await http.delete(`/api/v1/drafted_statuses/${id}`);
    return response.data;
}