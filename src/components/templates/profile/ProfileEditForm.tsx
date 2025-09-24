"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { Textarea } from "@/components/atoms/ui/textarea";
import { queryClient } from "@/components/molecules/providers/queryProvider";
import { useProfileMutation } from "@/hooks/queries/profile/useProfile";
import { createSchemas } from "@/lib/schema/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../atoms/ui/button";
import { sanitizeInput } from "@/utils";
import { cn } from "@/lib/utils";
import {
  CHANNEL_ORG_INSTANCE,
  DEFAULT_API_URL,
  MANDATORY_BIO,
} from "@/utils/constant";
import Cookies from "js-cookie";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import z from "zod";
import { useTString } from "@/lib/tString";

interface ProfileEditFormProps {
  userId: string;
  display_name: string;
  note: string;
  headerImage: File | string;
  avatarImage: File | string;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  userId,
  display_name,
  headerImage,
  avatarImage,
  note,
}) => {
  const router = useRouter();
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
  const channelOrg = CHANNEL_ORG_INSTANCE.split("//")[1];
  const checkMandatoryBio = note.includes(MANDATORY_BIO);
  const { theme } = useTheme();

  const [isLoading, startTransition] = useTransition();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(schemas.ProfileEditFormSchema),
    defaultValues: {
      display_name: display_name,
      note: sanitizeInput(note),
    },
  });

  const { mutateAsync, isPending } = useProfileMutation({
    onSuccess: (response) => {
      toast.success(t("toast.profile_updated"));
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["verify-auth-token"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get_account_info", userId],
        });
        router.push(`/@${response.acct}`);
      });
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong!");
    },
  });

  const onSubmit = async (
    data: z.infer<typeof schemas.ProfileEditFormSchema>
  ) => {
    const sanitizedData = {
      ...data,
      note: data.note + "\r\n\r\n ",
      avatar: avatarImage,
      header: headerImage,
    };
    mutateAsync(sanitizedData);
  };

  useEffect(() => {
    form.reset({
      display_name,
      note: sanitizeInput(note?.replace(" " + MANDATORY_BIO, "")),
      // note: sanitizeInput(note)
    });
  }, [display_name, note, form]);

  return (
    <div className="w-full md:mb-0 mb-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter display name" {...field} />
                </FormControl>
                <FormDescription className="text-xs px-2 text-gray-400">
                  3-29 Characters - Letters, numbers, special characters and
                  emojis
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "bg-gray-500 border-gray-500 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex flex-col field-sizing-content w-full border py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-32 rounded-md",
                      {
                        "bg-gray-100 border-gray-400": theme === "light",
                      }
                    )}
                  >
                    <div className="relative">
                      <Textarea
                        placeholder="Type your bio here"
                        className="border-gray-500 focus-visible:ring-0 focus-visible:border-gray-400 focus-visible:ring-offset-0 border-0 min-h-32"
                        rows={10}
                        // value={field.value}
                        {...field}
                      />

                      <p
                        className={cn(
                          "absolute bottom-2 right-2 text-xs text-gray-400 px-2",
                          form.watch(`note`)?.length > 300 && "text-orange-500"
                        )}
                      >
                        {form.watch(`note`)?.length ?? 0}
                        /300
                      </p>
                    </div>
                    {domain === channelOrg && checkMandatoryBio && (
                      <p className="px-3 mt-3">{MANDATORY_BIO}</p>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="text-xs px-2 text-gray-400">
                  Up to 300 characters. Letters, numbers, special characters and
                  emojis. Links count as 23 characters no matter their length.
                  Pre-set text will be included in your bio referring users to
                  more information, this won&apos;t be included in your
                  character count.
                </FormDescription>
              </FormItem>
            )}
          />

          <Button
            variant="default"
            type="submit"
            className="w-full bg-orange-900 hover:bg-orange-900 hover:opacity-90"
            loading={isPending || isLoading}
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
