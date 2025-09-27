import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={cn(
          "w-12 h-12 border-4 border-t-4 border-gray-200 border-t-orange-500 rounded-full animate-spin",
          className
        )}
      ></div>
    </div>
  );
}
