import http from "@/lib/http";

export const saveFCMToken = async (notification_token: string) => {
    await http.post("/api/v1/notification_tokens", {
        notification_token,
        platform_type: 'web'
    })
}