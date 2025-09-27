import { Input } from "@/components/atoms/ui/input";
import { useGifv } from "@/hooks/queries/gifv/useGifv";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { GifIcon } from "@/components/atoms/icons/Icons";
import { cn } from "@/lib/utils";
import { TooltipTrigger } from "@/components/atoms/ui/tooltip";
import { Tooltip } from "@/components/atoms/ui/tooltip";
import { TooltipContent } from "@/components/atoms/ui/tooltip";
import { useInfiniteScroll } from "@/hooks/customs/useInfiniteScroll";
import { useLocale } from "@/providers/localeProvider";
import Image from "next/image";

export type GifvProps = {
  onSelect: (url: string) => void;
  asButton?: boolean;
  noTooltip?: boolean;
  className?: string;
};

export const GifvModal = ({
  onSelect,
  asButton = true,
  noTooltip,
  className,
}: GifvProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const {t} = useLocale();
  const [debounced] = useDebounceValue(query, 200);
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    data,
    refetch,
  } = useGifv(debounced);

  useEffect(() => {
    refetch();
  }, [debounced]);

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-2 border-none",
                {
                  "text-white": asButton,
                },
                className
              )}
            >
              <GifIcon className="min-w-5 min-h-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        {noTooltip ? undefined : (
          <TooltipContent>
            <p>GIFs</p>
          </TooltipContent>
        )}
      </Tooltip>
      <DialogContent className=" text-foreground bg-background border max-w-lg max-h-[80dvh]">
        <DialogHeader>
          <DialogTitle>{t("compose.search_gif")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 h-[60dvh] overflow-auto">
          <Input
            className="border-white focus-within:!ring-0"
            type="text"
            placeholder={t("compose.search_tenor") as string}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full aspect-square rounded-md bg-white/10 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data?.pages?.flatMap((page) =>
                page?.results?.map((result) => (
                  <Image
                    onClick={() => {
                      onSelect(result.media_formats.gif.url);
                      setOpen(false);
                    }}
                    key={result.id}
                    className="rounded-md w-full aspect-square object-cover"
                    src={result.media_formats.gif.url}
                    alt="gifv file"
                  />
                ))
              )}
              <div
                ref={loadMoreRef}
                className="w-full aspect-square rounded-md bg-white/10 animate-pulse"
              />
              {isFetchingNextPage &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full aspect-square rounded-md bg-white/10 animate-pulse"
                  ></div>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
