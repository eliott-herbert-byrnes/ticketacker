import { format } from "date-fns";
import React from "react";
import { CommentContent } from "@/components/comment-content";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommentWithMetadata } from "../types";

type CommentItemProps = {
  comment: CommentWithMetadata;
  buttons: React.ReactNode[];
  sections: {
    label: string;
    content: React.ReactNode;
  }[];
};

const CommentItem = ({ comment, buttons, sections }: CommentItemProps) => {
  return (
    <div className="flex gap-x-2">
      <Card className="p-4 flex-1 flex flex-col gap-y-1">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {comment.isOwner
              ? "You"
              : (comment.user?.username ?? "Deleted User")}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(comment.createdAt, "yyyy-MM-dd, HH:mm")}
          </p>
        </div>

        <CommentContent titleMap={comment.mentions as Record<string, string> | null}>
          {comment.content}
        </CommentContent>

        {sections.map((section) => (
          <div className="space-y-2 mt-2" key={section.label}>
            <Separator />

            <h4 className="text-sm text-muted-foreground">{section.label}</h4>
            <div className="">{section.content}</div>
          </div>
        ))}
      </Card>

      <div className="flex flex-col gap-y-1">{buttons}</div>
    </div>
  );
};

export { CommentItem };
