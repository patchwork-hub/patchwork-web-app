import http from "@/lib/http"

export const revokeFCMToken = async (notification_token: string) => {
    await http.post("/api/v1/notification_tokens/revoke_token", {
        notification_token
    });
}