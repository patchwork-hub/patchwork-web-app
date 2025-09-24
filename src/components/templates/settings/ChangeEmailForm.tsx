"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import {
  createSchemas,
} from "@/lib/schema/validations";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../atoms/ui/button";
import {
  useChangeEmailMutation,
  useChangeNewsmastEmailMutation
} from "@/hooks/auth/useChangeEmail";
import { useAuthStore } from "@/store/auth/authStore";
import { useActiveDomainStore } from "@/store/auth/activeDomain";
import { setNewEmail, setToken } from "@/lib/auth";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { z } from "zod";
import { useTString } from "@/lib/tString";

const ChangeEmailForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const { userOriginInstance } = useAuthStore();
  const { domain_name } = useActiveDomainStore();
  const oldEmail = localStorage.getItem("oldEmail");

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(schemas.ChangeEmailFormSchema)
  });

  const { mutateAsync, isPending } = useChangeEmailMutation({
    onSuccess: async (response, variables) => {
      setToken(response.message.access_token, { isSignup: false });
      setNewEmail({
        newAccessToken: response.message.access_token,
        oldEmail,
        newEmail: variables.email,
        currentPassword: variables.current_password
      });
      router.push("/settings/info/change-email/verification");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong.");
      console.error("Change email error:", error);
    }
  });

  const { mutateAsync: changeNewsmastEmail } = useChangeNewsmastEmailMutation({
    onSuccess: async (response, variables) => {
      setNewEmail({
        oldEmail,
        newEmail: variables.email
      });
      router.push("/settings/info/change-email/verification");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  });

  const onSubmit = (data: z.infer<typeof schemas.ChangeEmailFormSchema>) => {
    if (userOriginInstance === "https://newsmast.social") {
      changeNewsmastEmail({ email: data.email, domain_name });
    } else {
      if (!isPending) {
        mutateAsync({ email: data.email, current_password: data.password });
      }
    }
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.new_email_address")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("login.new_email_address") as string} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.current_password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("login.current_password") as string}
                    showTogglePassword
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-orange-900 hover:bg-orange-900 hover:opacity-90"
            loading={isPending}
          >
            {t("common.update")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangeEmailForm;
