
import { translate } from "@/services/translate/translate";
import { useQuery } from "@tanstack/react-query";

export const useTranslate = (id?: string) => {
    return useQuery({
        queryKey: ["translate", id],
        queryFn: () => translate(id ?? ""),
        enabled: !!id,
    });
};
