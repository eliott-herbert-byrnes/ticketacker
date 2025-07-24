"use client";
import { LucideCircleCheck, LucidePencil } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateComment } from "../actions/update-comment";

type CommentUpdateButtonProps = {
  id: string;
  content: string;
  onSave: (newContent: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
};

const CommentUpdateButton = ({
  id,
  content,
  onSave,
  isEditing,
  setIsEditing,
}: CommentUpdateButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isEditing) {
      startTransition(() => {
        updateComment(id, content).then((res) => {
          if (res.status === "SUCCESS") {
            onSave(content);
            setIsEditing(false);
          }
        });
      });
    } else {
      setIsEditing(true);
    }
  };

  return (
    <>
      {isEditing ? (
        <Button
          variant="default"
          size="icon"
          onClick={handleClick}
          disabled={isPending}
          className="shrink-0 cursor-pointer"
        >
          {<LucideCircleCheck size={16} />}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={handleClick}
          disabled={isPending}
          className="shrink-0 cursor-pointer"
        >
          {<LucidePencil className="" size={16} />}
        </Button>
      )}
    </>
  );
};

export { CommentUpdateButton };
