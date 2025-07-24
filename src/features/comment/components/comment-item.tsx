"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CommentWithMetadata } from "../types";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentUpdateButton } from "./comment-update-button";

type CommentItemProps = {
  comment: CommentWithMetadata;
  buttons?: React.ReactNode[];
  isOwner: boolean;
};

const CommentItem = ({ comment, isOwner }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  return (
    <div className="flex gap-x-2 overflow-hidden">
      <Card className="p-4 flex-1 flex flex-col gap-y-3 overflow-hidden">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {comment.user?.username ?? 'Deleted User'}
          </p>
          <p className="text-xs text-muted-foreground">
            {comment.createdAt.toLocaleString().slice(0, 17)}
          </p>
        </div>

        {isEditing ? (
          <Textarea
            className="text-sm resize-none overflow-hidden"
            value={content}
            rows={3}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <p className="whitespace-pre-line text-sm">{content}</p>
        )}
      </Card>

      {isOwner && (
        <div className="flex flex-col gap-y-1">
          <CommentDeleteButton id={comment.id} />
          <CommentUpdateButton
            id={comment.id}
            content={content}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSave={setContent}
          />
        </div>
      )}
    </div>
  );
};


export { CommentItem };
