import { Button } from "@/components/atoms/ui/button";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import {
  useFilterInOutMutation,
  useRemoveOrUpdateFilterKeyword,
} from "@/hooks/mutations/profile/useChannelContent";
import { useGetMyTotalChannelList } from "@/hooks/queries/useChannelContent";
import { createSchemas } from "@/lib/schema/validations";
import { useTString } from "@/lib/tString";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editModalState?: { item: ChannelFilterKeyword };
  channelId: string;
};

export const FilterOutKeywordModal = ({
  isOpen,
  onClose,
  editModalState,
  channelId,
}: Props) => {
  const [infoMenu, setInfoMenu] = useState(false);
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const form = useForm<z.infer<typeof schemas.FilterOutKeywordSchema>>({
    resolver: zodResolver(schemas.FilterOutKeywordSchema),
    defaultValues: {
      keyword: editModalState?.item?.keyword || "",
      isHashtag: !!editModalState?.item?.is_filter_hashtag,
    },
  });

  const { data: myChannels } = useGetMyTotalChannelList();

  const { mutate, isPending } = useFilterInOutMutation({
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({
        queryKey: ["channel-filter-out-keyword-list", { channelId }],
      });
      toast.success(t("taost.item_created"));
      onClose();

      form.reset();
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
      onClose();
    },
  });

  const { mutate: editKeyword, isPending: isEditPending } =
    useRemoveOrUpdateFilterKeyword({
      onMutate(variables) {
        const queryKey = ["channel-filter-out-keyword-list", { channelId }];
        const previousData =
          queryClient.getQueryData<ChannelFilterKeyword[]>(queryKey);
        if (previousData) {
          const updatedData: ChannelFilterKeyword[] = previousData.map(
            (item) => {
              return item.id.toString() == variables.keywordId
                ? {
                    ...item,
                    keyword: variables.keyword,
                    is_filter_hashtag: variables.is_filter_hashtag,
                  }
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
      },
    });

  const onSubmit = (data: FormData) => {
    if (!myChannels || isPending || isEditPending) return;
    if (editModalState) {
      return editKeyword({
        keyword: data.keyword,
        channelId,
        keywordId: editModalState.item.id.toString(),
        operation: "edit",
        filter_type: "filter_out",
        is_filter_hashtag: data.isHashtag,
      });
    }
    mutate({
      keyword: data.keyword,
      channelId: myChannels[0]?.id,
      filter_type: "filter_out",
      is_filter_hashtag: data.isHashtag,
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
          will allow posts from the wider network which contain this keyword as
          a hashtag or plain text from appearing in the channel.
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

              <FormField
                control={form.control}
                name="isHashtag"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="p-2 border border-slate-200 rounded-sm mt-0 flex items-center gap-2">
                        <Checkbox
                          className="border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-red-500"
                          indicatorClassName="text-white"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <p className="text-sm">This keyword is a hashtag</p>
                      </div>
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
export default FilterOutKeywordModal;

type FormData = {
  keyword: string;
  isHashtag: boolean;
};
