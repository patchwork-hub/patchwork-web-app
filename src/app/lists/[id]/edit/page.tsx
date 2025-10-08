"use client";
import Header from "@/components/molecules/common/Header";

import PrimaryButton from "@/components/molecules/common/PrimaryButton";
import Toggle from "@/components/molecules/common/ToggleButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/ui/dropdown-menu";
import { FALLBACK_PREVIEW_IMAGE_URL } from "@/constants/url";
import { useEditListMutation } from "@/hooks/mutations/lists/useEditList";
import { useAccountsInList } from "@/hooks/queries/useAccountsInList.query";
import { useSingleList } from "@/hooks/queries/useSingleList";
import { createSchemas } from "@/lib/schema/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { GroupAvatar } from "@/components/atoms/ui/avatar-stack";
import { Input } from "@/components/atoms/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/atoms/ui/label";
import { useTheme } from "next-themes";
import { useLocale } from "@/providers/localeProvider";
import { z } from "zod";
import { useTString } from "@/lib/tString";
import { useActiveDomainStore } from "@/stores/auth/activeDomain";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";

export default function EditCreateForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { theme } = useTheme();
  const { t } = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const { domain_name: activeDomain } = useActiveDomainStore();
  const { mutate, isPending } = useEditListMutation();
  const { data: list, isLoading } = useSingleList({
    id,
    domain_name: activeDomain,
  });

  const { data: AccountsInList } =
    useAccountsInList({
      id,
      domain_name: activeDomain,
    });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof schemas.listSchema>>({
    resolver: zodResolver(schemas.listSchema),
    defaultValues: {
      name: "",
    },
  });

  const options = useMemo(() => [
  { title: t("list.members_of_the_list"), value: "list" },
  { title: t("list.no_one"), value: "none" },
  { title: t("list.any_followed_user"), value: "followed" },
], [t]);

  const [selected, setSelected] = useState(options[0]);
  const [formData, setFormData] = useState({
    acceptTerms: false,
  });

  useEffect(() => {
    if (list && !isLoading) {
      setValue("name", list.title || "");
      setFormData({ acceptTerms: list.exclusive || false });

      const selectedOption =
        options.find((opt) => opt.value === list.replies_policy) || options[0];
      setSelected(selectedOption);
    }
  }, [list, isLoading, setValue, options]);

  const handleToggle = (newState: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: newState }));
  };
  const countAccount = AccountsInList?.length ?? 0;
  

  const onSubmit = (data: z.infer<typeof schemas.listSchema>) => {
    const mutateData = {
      payload: {
        id,
        title: data.name,
        exclusive: formData.acceptTerms,
        replies_policy: selected.value,
      },
      id,
    };
    mutate(mutateData, {
      onSuccess: () => {
        reset();
        router.push(`/lists`);
      },
      onError: (error) => {
        console.error("Error updating list:", error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Header title={t("screen.edit_list")} />
      <form onSubmit={handleSubmit(onSubmit)} className="h-full p-4">
        <div className="mb-4">
          <Label htmlFor="listName" className="block mb-2">
            {t("list.list_name")}
          </Label>
          <Input
            id="listName"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-orange-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="members" className="block mb-2">
            {t("list.include_reply")}
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="w-fit flex items-center space-x-3 text-orange-500 cursor-pointer">
                <span>{selected.title}</span> <ChevronDown />
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className={cn("w-full bg-black", {
                "bg-white": theme === "light",
              })}
            >
              {options.map((option, idx) => (
                <DropdownMenuItem
                  key={`${option.value}-${idx}`}
                  onClick={() => setSelected(option)}
                  className="cursor-pointer"
                >
                  {option.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="relative mb-4 flex items-center justify-between space-x-4 cursor-pointer"
          onClick={() => router.push(`/lists/${id}/members`)}
        >
          <div className="flex flex-col">
            <Label htmlFor="exclusive" className="flex-1">
              {t("list_members")}
            </Label>
            <span className="text-orange-500 underline text-sm">
              {countAccount > 1
                ? t("list.member_plural", { count: countAccount })
                : t("list.member", { count: countAccount })}
            </span>
          </div>

          <div className="relative flex items-center w-[120px] justify-end">
            <GroupAvatar
              users={
                AccountsInList?.map((acc) => ({
                  id: acc.id,
                  avatar: acc.avatar ?? FALLBACK_PREVIEW_IMAGE_URL,
                  name: acc.display_name || acc.username,
                })) ?? []
              }
              maxDisplayed={3}
              size="h-10 w-10"
              className="flex items-center"
            />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between space-x-4">
          <div className="flex flex-col">
            <Label htmlFor="exclusive" className="flex-1">
              {t("list.list_only_members")}
            </Label>
            <span className="text-gray-400 text-sm">
              {t("list.list_only_member_desc")}
            </span>
          </div>
          <Toggle
            initialState={false}
            state={formData.acceptTerms}
            onToggle={handleToggle}
          />
        </div>

        <PrimaryButton isPending={isPending} text={t("list.update_list")} type="submit" />
      </form>
    </>
  );
}
