import http from "@/lib/http"
import { Rule, Report } from "@/types/report";

export const getRules = async () => {
    const response = await http.get<Rule[]>("/api/v1/instance/rules");
    return response.data;
};

type FileReportParams = {
    account_id: string;
    status_ids?: string[];
    comment: string;
    forward: boolean;
    category: string;
    rule_ids?: string[];
}

export const fileReport = async (params: FileReportParams) => {
    const formData = new FormData();
    formData.append('account_id', params.account_id);
    if (params.status_ids) params.status_ids.forEach(id => formData.append('status_ids[]', id));
    if (params.comment) formData.append('comment', params.comment);
    if (params.forward) formData.append('forward', String(params.forward));
    formData.append('category', params.category);
    if (params.rule_ids) params.rule_ids.forEach(id => formData.append('rule_ids[]', id));

    const response = await http.post<Report>("/api/v1/reports", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};