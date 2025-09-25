import { z } from "zod";

export const createSchemas = (
  t?: (key: string, options?: Record<string, unknown>) => string
) => {
  const translate = t ?? ((key: string) => key);
  return {
    SignInFormSchema: z.object({
      username: z
        .string({ message: translate("validation.email_required") })
        .min(1, translate("validation.email_required"))
        .email(translate("validation.email_invalid")),
      password: z
        .string({ message: translate("validation.password_required") })
        .min(1, translate("validation.password_required")),
    }),

    SignUpFormSchema: z
      .object({
        email: z
          .string({ message: translate("validation.email_required") })
          .min(1, translate("validation.email_required"))
          .email(translate("validation.email_invalid")),
        username: z
          .string({ message: translate("validation.username_required") })
          .min(1, translate("validation.username_required"))
          .nonempty({ message: translate("validation.username_required") }),
        password: z
          .string({ message: translate("validation.password_required") })
          .min(8, translate("validation.password_min_length", { min: 8 })),
        repeatPassword: z
          .string({
            message: translate("validation.confirm_password_required"),
          })
          .min(8, translate("validation.password_min_length", { min: 8 })),
      })
      .refine((data) => data.password === data.repeatPassword, {
        message: translate("validation.passwords_mismatch"),
        path: ["repeatPassword"],
      }),

    ForgotPasswordFormSchema: z.object({
      email: z
        .string({
          message: translate("validation.email_required"),
        })
        .min(1, translate("validation.email_required"))
        .email(translate("validation.email_invalid")),
    }),

    ResetPasswordFormSchema: z
      .object({
        password: z
          .string({
            message: translate("validation.password_required"),
          })
          .min(1, translate("validation.password_required")),
        password_confirmation: z
          .string({
            message: translate("validation.confirm_password_required"),
          })
          .min(1, translate("validation.confirm_password_required")),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: translate("validation.passwords_mismatch"),
        path: ["password_confirmation"],
      }),

    ChangePasswordFormSchema: z
      .object({
        currentPassword: z
          .string({
            message: translate("validation.current_password_required"),
          })
          .min(1, translate("validation.current_password_required")),
        newPassword: z
          .string({
            message: translate("validation.new_password_required"),
          })
          .min(1, translate("validation.new_password_required")),
        repeatNewPassword: z
          .string({
            message: translate("validation.confirm_new_password_required"),
          })
          .min(1, translate("validation.confirm_new_password_required")),
      })
      .refine((data) => data.newPassword === data.repeatNewPassword, {
        message: translate("validation.passwords_mismatch"),
        path: ["repeatNewPassword"],
      }),

    ChangeEmailFormSchema: z.object({
      email: z
        .string()
        .email(translate("validation.email_invalid"))
        .min(1, translate("validation.email_required")),
      password: z
        .string()
        .min(6, translate("validation.password_min_length", { min: 6 }))
        .min(1, translate("validation.password_required")),
    }),

    ProfileEditFormSchema: z.object({
      display_name: z
        .string({
          message: translate("validation.display_name_required"),
        })
        .min(
          3,
          translate("validation.display_name_length", { min: 3, max: 29 })
        )
        .max(
          29,
          translate("validation.display_name_length", { min: 3, max: 29 })
        ),
      note: z
        .string({
          message: translate("validation.bio_required"),
        })
        .min(1, translate("validation.bio_required"))
        .max(300, translate("validation.bio_max_length", { max: 300 })),
    }),

    listSchema: z.object({
      name: z
        .string()
        .trim()
        .min(3, {
          message: translate("validation.list_name_length", {
            min: 3,
            max: 50,
          }),
        })
        .max(50, {
          message: translate("validation.list_name_length", {
            min: 3,
            max: 50,
          }),
        })
        .regex(/^[a-zA-Z0-9\s-]+$/, {
          message: translate("validation.list_name_chars"),
        })
        .nonempty({ message: translate("validation.list_name_required") }),
    }),

    AddChannelFormSchema: z.object({
      custom_channel: z.boolean(),
      contributors_or_hashtags: z.boolean(),
      contributors_and_hashtags: z.boolean(),
    }),

    HashtagSchema: z.object({
      hashtag: z
        .string()
        .min(1, { message: translate("validation.hashtag_required") }),
    }),

    KeywordSchema: z.object({
      keyword: z
        .string()
        .min(1, { message: translate("validation.keyword_required") }),
    }),

    FilterOutKeywordSchema: z.object({
      keyword: z
        .string()
        .min(1, { message: translate("validation.keyword_required") }),
      isHashtag: z.boolean(),
    }),
  };
};

export type Schemas = ReturnType<typeof createSchemas>;
