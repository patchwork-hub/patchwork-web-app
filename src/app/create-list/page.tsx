"use client";
import PrimaryButton from "@/components/atoms/common/PrimaryButton";
import Toggle from "@/components/atoms/common/ToggleButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/ui/dropdown-menu";
import { useCreateListMutation } from "@/hooks/mutations/lists/useCreateList";
import { createSchemas } from "@/lib/schema/validations";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/molecules/providers/localeProvider";
import { Input } from "@/components/atoms/ui/input";
import z from "zod";
import { useTString } from "@/lib/tString";

export default function ListCreateForm() {
  const { theme } = useTheme();
  const {t} = useLocale();
  const tString = useTString();
  const schemas = createSchemas(tString);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<z.infer<typeof schemas.listSchema>>({
      resolver: zodResolver(schemas.listSchema),
      defaultValues: {
        name: "",
      },
    });
  
  const { mutate, isPending } = useCreateListMutation();
  const router = useRouter();
   const options = [
    { title: `${t("list.members_of_the_list")}`, value: "list" },
    { title: `${t("list.no_one")}`, value: "none" },
    { title: `${t("list.any_followed_user")}`, value: "followed" },
  ];
  const [selected, setSelected] = useState(options[0]);
  const [formData, setFormData] = useState({
    acceptTerms: false,
  });
  const handleToggle = (newState: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: newState }));
  };

  const onSubmit = (data: z.infer<typeof schemas.listSchema>) => {
    if (data) {
      const mutateData = {
        title: data.name,
        exclusive: formData.acceptTerms,
        replies_policy: selected.value,
      };
      mutate(mutateData, {
        onSuccess: (data) => {
          reset();

          router.push(`/lists/${data.id}/members`);
        },
        onError: (error) => {
          console.error("Error creating list:", error);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full p-4">
      <div className="mb-4">
        <label htmlFor="listName" className="block text-foreground mb-2">
          {t("list.list_name")}
        </label>
        <Input
          id="listName"
          {...register("name")}
          
        />
        {errors.name && (
          <p className="text-orange-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="members" className="block text-foreground mb-2">
          {t("list.include_reply")}
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <p className="w-fit flex items-center space-x-3 text-orange-500">
              <span>{selected.title}</span> <ChevronDown />
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className={cn("w-full bg-black", {
              "bg-white": theme === "light",
            })}
          >
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSelected(option)}
                className="cursor-pointer "
              >
                {option.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 flex items-center justify-between space-x-4">
        <div className="flex flex-col">
          <label htmlFor="exclusive" className="text-foreground flex-1">
            {t("list_members")}
          </label>
          <span className="text-gray-400 text-sm">
            {t("list.list_only_member_desc")}
          </span>
        </div>
        <Toggle initialState={formData.acceptTerms} onToggle={handleToggle} />
      </div>

      <PrimaryButton isPending={isPending} text={t("list.create_list")} type="submit" />
    </form>
  );
}
