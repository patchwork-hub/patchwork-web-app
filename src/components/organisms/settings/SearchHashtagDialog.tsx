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
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import { useRemoveOrUpdateHashtag } from "@/hooks/mutations/profile/useChannelContent";
import {
  useCreateChannelHashtagMutation,
  useGetMyTotalChannelList
} from "@/hooks/queries/useChannelContent";
import { createSchemas } from "@/lib/schema/validations";
import { useTString } from "@/lib/tString";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editModalState?: { item: ChannelHashtag };
  channelId: string;
};

const SearchHashtagModal = ({
  isOpen,
  onClose,
  editModalState,
  channelId
}: Props) => {
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);

  const form = useForm<z.infer<typeof schemas.HashtagSchema>>({
    resolver: zodResolver(schemas.HashtagSchema),
    defaultValues: {
      hashtag: editModalState?.item.name || ""
    }
  });

  const { data: myChannels } = useGetMyTotalChannelList();

  const { mutate, isPending } = useCreateChannelHashtagMutation({
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({
        queryKey: ["channel-hashtag-list", { channelId }]
      });
      toast.success(t("taost.item_created"));
      onClose();
      form.reset({
        hashtag: ""
      });
    },
    onError: (error) => {
      const data = error?.response?.data as any;
      if (data?.error) {
        toast.error(data?.error);
      }
      onClose();
    }
  });

  const { mutate: editHashtag, isPending: isEditPending } =
    useRemoveOrUpdateHashtag({
      onMutate({ hashtagId, hashtag }) {
        const queryKey = ["channel-hashtag-list", { channelId }];
        const previousData =
          queryClient.getQueryData<ChannelHashtag[]>(queryKey);
        if (previousData) {
          const updatedData: ChannelHashtag[] = previousData.map((item) => {
            return item.id.toString() == hashtagId
              ? { ...item, hashtag: hashtag, name: hashtag }
              : item;
          });
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
      return editHashtag({
        hashtag: "#" + data.hashtag,
        channelId,
        hashtagId: editModalState.item.id.toString(),
        operation: "edit"
      });
    }
    mutate({
      hashtag: "#" + data.hashtag,
      channelId: myChannels[0]?.id
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Add a channel hashtag</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mt-1 text-sm text-gray-400">
            Add a channel hashtag using the form below. Every post on this
            hashtag will appear in the channel. This allows channel members to
            post to the channel even when they’re somewhere else in the network.
        </DialogDescription>
        <div className="mt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="hashtag"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter channel hashtag" {...field} />
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

export default SearchHashtagModal;

type FormData = {
  hashtag: string;
};
