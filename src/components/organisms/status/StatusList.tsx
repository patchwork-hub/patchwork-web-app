import { Status as StatusType } from "@/types/status";
import Status from "./Status";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";

export const StatusList = ({
  statusList,
  className
}: {
  statusList: StatusType[];
  className?: string;
}) => {
  return statusList ? (
    <div className={cn("flex flex-col", className)}>
      {statusList?.map((status, idx) => {
        const uniqueKey = `status-${status.id}-${status.content.length}-${
          status.reblog ? status.reblog.content.length : ""
        }`;
        return (
          <Status
            direct={status?.visibility === "direct"}
            key={uniqueKey}
            status={status.reblog ?? status}
            className={cn({
              "border-t-0": idx === 0
            })}
          />
        );
      })}
    </div>
  ) : null;
};
