import { Button } from "@/components/atoms/ui/button";
import LoginDialog from "@/components/organisms/status/LoginDialog";
import { useGetConversationByAccountId } from "@/hooks/queries/conversations/useGetConversationByAccountId";
import useLoggedIn from "@/stores/auth/useLoggedIn";
import { useConversationStore } from "@/stores/conversations/conversation";
import { MessageSquareMore } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

type ProfileChatProps = {
  accountId: string;
  acct: string;
};

export const ProfileChat: FC<ProfileChatProps> = ({ accountId, acct }) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const isLoggedIn = useLoggedIn();
  const setConversation = useConversationStore(
    (state) => state.setConversation
  );
  const { data: conversation, isLoading } =
    useGetConversationByAccountId(accountId);
  const handleClick = () => {
    if (conversation && Object.keys(conversation).length > 0) {
      setConversation(conversation);
      router.push("/conversations/chat");
    } else {
      router.push("/conversations/new?acct=" + acct);
    }
  };

  return (
    <>
      <Button
        className="p-0 w-fit h-fit rounded-full border-[0.5px] border-[#96A6C2] aspect-square"
        disabled={isLoading}
        variant="link"
        onClick={() => {
          if (isLoggedIn) {
            handleClick();
          } else {
            setOpenDialog(true);
          }
        }}
      >
        <MessageSquareMore className="!w-[20px] !h-[20px] text-[#96A6C2]" />
      </Button>
      <LoginDialog
        actionType="login"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
};
