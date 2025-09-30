import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const getInitials = (name: string): string => {
  if (!name) return "?";
  const names = name.split(" ").filter(Boolean);
  if (names.length === 0) return "?";
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
};

type UserInfo = {
  id: string | number;
  avatar?: string | null;
  name: string;
}

export type GroupAvatarProps = {
  users: UserInfo[];
  maxDisplayed?: number;
  size?: string;
  className?: string;
}

const GroupAvatar: React.FC<GroupAvatarProps> = ({
  users = [],
  maxDisplayed = 3,
  size = "h-8 w-8",
  className
}) => {
  const displayedUsers = users.slice(0, maxDisplayed);
  const remainingCount = users.length - displayedUsers.length;

  return (
    <div className={cn("flex items-center -space-x-4", className)}>
      {displayedUsers.map((user) => (
        <Avatar
          key={user.id}
          className={cn(
            size,
            "border-background border-2 dark:border-gray-800"
          )}
        >
          <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar
          className={cn(
            size,
            "border-background border-2 dark:border-gray-800"
          )}
        >
          <AvatarFallback>+{remainingCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export { GroupAvatar };
