"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../atoms/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/atoms/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/ui/popover";
import { Button } from "@/components/atoms/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";
import { routeFilter } from "@/utils";
import { setToken } from "@/lib/auth";
import { DEFAULT_REDIRECT_URI } from "@/utils/constant";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLocale } from "@/providers/localeProvider";
import { useAuthorizeInstanceMutation, useRequestPermissionToInstanceMutation, useSearchServerInstance } from "@/hooks/mutations/auth/useSearchInstance";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";

type SignInWithMastodonProps
  = React.ComponentPropsWithoutRef<"div"> & {
  setSignInWithMastodon: React.Dispatch<React.SetStateAction<boolean>>;
  code?: string;
}

const SignInWithMastodon = ({
  code,
  setSignInWithMastodon,
}: SignInWithMastodonProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchDomain, setSearchDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const baseUrl = window.location.origin;
  const { theme } = useTheme();
  // Retrieve stored client details from localStorage
  const storedClientId = localStorage.getItem("client_id");
  const storedClientSecret = localStorage.getItem("client_secret");
  const storedDomain = localStorage.getItem("domain");
  const { t } = useLocale();

  // Custom hooks for API interactions
  const { data: instanceData } = useSearchServerInstance({
    domain: searchDomain,
    enabled: searchDomain.length > 0,
  });

  const { mutate: requestPermission, isPending: isRequesting } =
    useRequestPermissionToInstanceMutation({
      onSuccess: (res) => {
        const authParams = {
          client_id: res.client_id,
          client_secret: res.client_secret,
          response_type: "code",
          redirect_uri: DEFAULT_REDIRECT_URI,
          scope: "read write follow push",
        };
        const authUrl = `https://${searchDomain}/oauth/authorize?${routeFilter(
          authParams
        )}`;
        localStorage.setItem("client_id", res.client_id);
        localStorage.setItem("client_secret", res.client_secret);
        localStorage.setItem("domain", searchDomain);
        Cookies.set("domain", searchDomain);
        window.location.href = authUrl;
      },
      onError: () => {
        toast.error(t("toast.failed_to_request_permission"));
      },
    });

  const { mutate: authorizeInstance, isPending } = useAuthorizeInstanceMutation(
    {
      onSuccess: (res) => {
        if (res?.access_token) {
          setToken(res.access_token, { isSignup: false });
          localStorage.removeItem("client_id");
          localStorage.removeItem("client_secret");
          localStorage.removeItem("domain");
          toast.success(t("toast.signin_success"));
          router.refresh();
          router.replace("/");
        }
      },
      onError: (error) => {
        const errorMessage =
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? (error.response.data as { error: string }).error
            : "Authorization failed.";
        setErrorMessage(errorMessage);
        router.push("/auth/sign-in");
      },
    }
  );

  // Debounced search handler
  const handleSearch = useDebouncedCallback((value) => {
    setSearchDomain(value);
  }, 1000);

  // Handle login button click
  const handleLogin = useCallback(() => {
    if (instanceData && !isRequesting) {
      requestPermission({ domain: instanceData.domain });
      setIsLoading(true);
    }
  }, [instanceData, isRequesting, requestPermission]);

  // Handle authorization on page load (callback from Mastodon)
  useEffect(() => {
    if (storedClientId && storedClientSecret && storedDomain) {
      const urlParams = new URLSearchParams(window.location.search);
      if (code) {
        authorizeInstance({
          grant_type: "authorization_code",
          client_id: storedClientId,
          client_secret: storedClientSecret,
          redirect_uri: `${baseUrl}/auth/sign-in`,
          domain: storedDomain,
          code,
        });
      }
    }
  }, [
    code,
    storedClientId,
    storedClientSecret,
    storedDomain,
    authorizeInstance,
    baseUrl,
  ]);

  // Render server details in the command item
  const renderServerDetails = () => (
    <div className="w-full">
      {instanceData?.thumbnail.url && (
        <Image
          className="w-full h-28 aspect-square object-cover rounded-md mb-2 bg-background"
          width={200}
          height={100}
          src={instanceData.thumbnail.url}
          alt={instanceData.title}
        />
      )}
      <div className="space-y-2 flex-1 bg-background">
        <p className="text-sm">
          {instanceData?.title} - {instanceData?.domain}
        </p>
        <p className="text-sm">{instanceData?.description}</p>
        <p className="text-sm">
          {t("login.monthly_user")} -{" "}
          {formatNumber(instanceData?.usage?.users?.active_month || 0)}
        </p>
        <Button
          variant="outline"
          className={cn("w-full", {
            "text-foreground hover:text-gray-500": theme === "light",
          })}
          onClick={handleLogin}
          disabled={isRequesting}
        >
          {isRequesting ? "Requesting..." : "Login"}
        </Button>
      </div>
    </div>
  );

  if (isPending || isLoading || code) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Dialog open={!!errorMessage} onOpenChange={() => setErrorMessage("")}>
      <Card className="bg-background text-foreground w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <h2>{t("common.welcome_back")}</h2>
          <CardDescription>
            {t("login.mastodon_login_instruction")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className={cn(
                  "w-full justify-between bg-background text-foreground hover:text-foreground",
                  {
                    "text-white hover:text-gray-200": theme === "light",
                  }
                )}
              >
                <span className="text-sm text-foreground truncate">
                  {instanceData
                    ? `${instanceData.title} - ${instanceData.domain}`
                    : `${t("login.select_server")}`}
                </span>
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" min-w-[334px] p-0">
              <Command
                shouldFilter={false}
                className="bg-background text-foreground"
              >
                <CommandInput
                  placeholder={t("login.server_placeholder") as string}
                  className="w-full h-9"
                  onValueChange={handleSearch}
                />
                <CommandList>
                  {instanceData ? (
                    <CommandGroup>
                      <CommandItem>{renderServerDetails()}</CommandItem>
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>{t("login.no_server_found")}</CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex justify-center items-center gap-2">
            <p>{t("login.have_account")}</p>
            <Button onClick={() => setSignInWithMastodon(false)}>
              {t("login.sign_in")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <DialogContent className="max-w-sm! space-y-4 py-10">
        <DialogHeader className="flex flex-col justify-center items-center gap-6">
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{errorMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-center!">
          <Button className="w-[120px]" onClick={() => setErrorMessage("")}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInWithMastodon;
