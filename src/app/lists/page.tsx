"use client";
import Header from "@/components/molecules/common/Header";
import LoadingSpinner from "@/components/molecules/common/LoadingSpinner";
import {
  Dialog,
  DialogTrigger,
} from "@/components/atoms/ui/dialog";
import { Modal } from "@/components/atoms/ui/modal";
import { useLocale } from "@/providers/localeProvider";
import { useDeleteListMutation } from "@/hooks/mutations/lists/useDeleteList";
import { useListsQueries } from "@/hooks/queries/useLists.query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRightIcon, Menu, PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ListsPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {t} = useLocale();
  const [deleteListId, setDeleteListId] = useState<string | number>(
    ""
  );
  const { data: myLists, isLoading: myListsLoading } = useListsQueries();
  const { mutate: deleteList } = useDeleteListMutation();
  const router = useRouter();
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const handleDeleteList = () => {
    deleteList(deleteListId, {
      onSuccess: () => {
        setIsOpen(false);
        router.push(`/lists`);
      },
      onError: () => {
        toast.error(t("toast.delete_list_failed"));
      },
    });
  };

  const sortingLists = useMemo(() => {
    return myLists?.slice().reverse();
  }, [myLists]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative h-full">
        <Header title={t("screen.lists")} />
        <AnimatePresence mode="wait">
          {myListsLoading ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              key="lists-grid"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4 justify-start w-full max-w-full mb-auto mt-4"
            >
              {sortingLists && sortingLists?.length > 0 ? (
                sortingLists?.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`cursor-pointer flex items-center justify-between px-4 pb-2 ${
                      index === sortingLists.length - 1
                        ? ""
                        : " border-b border-b-gray-600"
                    }`}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                    onClick={() => {
                      router.push(`/lists/${item.id}`);
                    }}
                  >
                    <div className="flex items-center">
                      <Menu className="w-5 h-5 hover:opacity-70 transition-opacity duration-300 mr-3" />
                      <p className="text-start">{item.title}</p>
                    </div>

                    <div className="flex items-center">
                      <ChevronRightIcon className="w-5 h-5 hover:opacity-70 transition-opacity duration-300" />
                      <DialogTrigger asChild>
                        <Trash2
                          className=" ml-3 w-5 h-5 hover:opacity-70 transition-opacity duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteListId(item.id);
                            setIsOpen(true);
                          }}
                          // onClick={(e) => handleDeleteList(item.id, e)}
                        />
                      </DialogTrigger>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 flex justify-center items-center">
                  <p>{t("common.no_statuses_found")}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-10 max-sm:bottom-28 right-4">
          <button
            className="bg-orange-500 hover:opacity-70 transition-opacity duration-300 cursor-pointer text-white font-bold p-3 rounded-full shadow-lg"
            onClick={() => router.push("/create-list")}
          >
            <PlusIcon />
          </button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t("list.delete_list_title")}
      >
        <p className="py-4">{t("list.delete_list_message")}</p>
        <div className="w-full flex items-center justify-end space-x-6">
          <button
            className="cursor-pointer hover:underline"
            onClick={() => setIsOpen(false)}
          >
            {t("common.cancel")}
          </button>
          <button
            className="text-orange-500 cursor-pointer hover:opacity-90 transition-colors duration-300"
            onClick={handleDeleteList}
          >
            {t("list.delete_list_confirm_text")}
          </button>
        </div>
      </Modal>
    </Dialog>
  );
}
