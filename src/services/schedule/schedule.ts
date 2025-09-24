import { StatusComposeFormData } from "@/components/organisms/compose/types";
import http from "@/lib/http"
import { Schedule } from "@/types/schedule";

export const getSchedules = async () => {
    const response = await http.get<Schedule[]>("/api/v1/scheduled_statuses");
    return response.data;
}

export const updateSchedule = async ({ id, data }: { id: string, data: StatusComposeFormData }) => {
    const response = await http.put<Schedule>(`/api/v1/scheduled_statuses/${id}`, data);
    return response.data;
}

export const deleteSchedule = async (id: string) => {
    const response = await http.delete(`/api/v1/scheduled_statuses/${id}`);
    return response.data;
}