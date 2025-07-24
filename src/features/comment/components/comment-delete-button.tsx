"use client";
import { LucideTrash } from "lucide-react";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteComment } from "../actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
};

const CommentDeleteButton = ({ id }: CommentDeleteButtonProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    trigger: <Button className="cursor-pointer" variant="outline" size="icon"><LucideTrash/></Button>,
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { CommentDeleteButton };
