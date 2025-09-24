import http from "@/lib/http";

export const deleteAccount = async () => {
    const response = await http.post<{ message: string }>("/community_admins/modify_account_status", {
        account_status: 2
    },
        {
            baseURL: process.env.NEXT_PUBLIC_DASHBOARD_API_URL
        });
    return response.data;
}