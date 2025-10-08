"use client";
import React, { use, useState } from "react";
import Header from "@/components/molecules/common/Header";
import { ListTimeline } from "@/components/organisms/status/ListTimeline";
import { useSingleList } from "@/hooks/queries/useSingleList";
import { useActiveDomainStore } from "@/stores/auth/activeDomain";
import { useDeleteListMutation } from "@/hooks/mutations/lists/useDeleteList";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/atoms/ui/modal";

export default function ListDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { domain_name: activeDomain } = useActiveDomainStore();
  const { data: list } = useSingleList({
    id,
    domain_name: activeDomain,
  });
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const { mutate: deleteList } = useDeleteListMutation();

  const handleDelete = () => {
    if (id) {
      deleteList(id);
      router.push("/lists");
    }
  };
  return (
    <>
      <Header
        title={(list && list.title) ?? ""}
        setting
        handleDelete={() => {
          setDeleteModal(true);
        }}
        handleEditMember={() => router.push(`/lists/${id}/members`)}
        handleEditInfo={() => {
          router.push(`/lists/${id}/edit`);
        }}
      />
      <div className="py-4 pt-0">
        <ListTimeline id={id} />
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Are you sure you want to delete list?"
      >
        <p className="py-4">This action is irreversible.</p>
        <div className="w-full flex items-center justify-end space-x-6">
          <button
            className="cursor-pointer hover:underline"
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="text-orange-500 cursor-pointer hover:opacity-90 transition-colors duration-300"
            onClick={handleDelete}
          >
            Delete anyway
          </button>
        </div>
      </Modal>
    </>
  );
}
