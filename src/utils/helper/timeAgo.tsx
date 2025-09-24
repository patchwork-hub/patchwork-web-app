import React from "react";

type Timestamp = string | Date;

export const getTimeAgo = (timestamp: Timestamp): string => {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now.getTime() - created.getTime();

  if (diffMs < 0) return "in the future";

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths >= 1) {
    return `${diffMonths} mo ago`;
  } else if (diffDays >= 1) {
    return `${diffDays} d ago`;
  } else if (diffHours >= 1) {
    return `${diffHours} h ago`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes} min ago`;
  } else {
    return `${diffSeconds} sec ago`;
  }
};

interface TimeAgoProps {
  timestamp: Timestamp;
  className?: string;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp, className }) => {
  return <span className={className}>{getTimeAgo(timestamp)}</span>;
};

export default TimeAgo;
