import { Button } from "@/components/atoms/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/atoms/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { useLocale } from "@/providers/localeProvider";
import { queryClient } from "@/providers/queryProvider";
import {
  useFilterInOutMutation,
  useRemoveOrUpdateFilterKeyword
} from "@/hooks/mutations/profile/useChannelContent";
import { useGetMyTotalChannelList } from "@/hooks/queries/useChannelContent";
import { createSchemas} from "@/lib/schema/validations";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ChannelFilterKeyword } from "@/types/patchwork";
import { useTString } from "@/lib/tString";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editModalState?: { item: ChannelFilterKeyword };
  channelId: string;
};

export const FilterInKeywordModal = ({
  isOpen,
  onClose,
  editModalState,
  channelId
}: Props) => {
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const form = useForm<z.infer<typeof schemas.KeywordSchema>>({
    resolver: zodResolver(schemas.KeywordSchema),
    defaultValues: {
      keyword: editModalState?.item?.keyword || ""
    }
  });

  const { data: myChannels } = useGetMyTotalChannelList();

  const { mutate, isPending } = useFilterInOutMutation({
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({
        queryKey: ["channel-filter-keyword-list", { channelId }]
      });
      toast.success(t("taost.item_created"));
      onClose();
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
      onClose();
    }
  });

  const { mutate: editKeyword, isPending: isEditPending } =
    useRemoveOrUpdateFilterKeyword({
      onMutate(variables) {
        const queryKey = ["channel-filter-keyword-list", { channelId }];
        const previousData =
          queryClient.getQueryData<ChannelFilterKeyword[]>(queryKey);
        if (previousData) {
          const updatedData: ChannelFilterKeyword[] = previousData.map(
            (item) => {
              return item.id.toString() == variables.keywordId
                ? { ...item, keyword: variables.keyword }
                : item;
            }
          );
          queryClient.setQueryData(queryKey, updatedData);
        }
      },
      onSuccess: () => {
        toast.success(t("taost.item_updated"));
        onClose();
      },
      onError: (error) => {
        toast.error(error?.message || "Something went wrong!");
        onClose();
      }
    });

  const onSubmit = (data: FormData) => {
    if (!myChannels || isPending || isEditPending) return;
    if (editModalState) {
      return editKeyword({
        keyword: data.keyword,
        channelId,
        keywordId: editModalState.item.id.toString(),
        operation: "edit",
        filter_type: "filter_in",
        is_filter_hashtag: false
      });
    }
    mutate({
      keyword: data.keyword,
      channelId: myChannels[0]?.id,
      filter_type: "filter_in",
      is_filter_hashtag: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Add keyword filtering</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-1 text-sm text-gray-400">
            Add a new keyword filter for this channel using the form below. This
            will allow posts from the wider network which contain this keyword
            as a hashtag or plain text from appearing in the channel.
        </DialogDescription>
        <div className="mt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter keyword here" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isPending || isEditPending}
                  disabled={isPending || isEditPending}
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default FilterInKeywordModal;

type FormData = {
  keyword: string;
};
