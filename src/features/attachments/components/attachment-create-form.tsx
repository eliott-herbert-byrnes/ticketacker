"use client";
import { AttachmentEntity } from "@prisma/client";
import { X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAttachments } from "../actions/create-attachments";
import { ACCEPTED } from "../constants";

type AttachmentCreateFormProps = {
  entityId: string;
  entity: AttachmentEntity;
  buttons?: React.ReactNode;
  onSuccess?: () => void;
};

type PreviewFile = {
  name: string;
  type: string;
  url: string;
};

const AttachmentCreateForm = ({
  entityId,
  entity,
  buttons,
  onSuccess,
}: AttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, { entity, entityId }),
    EMPTY_ACTION_STATE
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const isImage = (type: string) => type.startsWith("image/");

  const fileStatus =
    files.length === 0
      ? "No file chosen"
      : files.map(f => f.name).join(", ");

  const buildPreviews = (fs: File[]) =>
    fs.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      type: f.type,
    }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const next = Array.from(e.target.files);

    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setFiles(next);

    setPreviews(buildPreviews(next));
  };

  const removeAtIndex = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url);

    const nextFiles = files.filter((_, i) => i !== idx);
    setFiles(nextFiles);

    const nextPreviews = previews.filter((_, i) => i !== idx);
    setPreviews(nextPreviews);

    const dt = new DataTransfer();
    nextFiles.forEach((f) => dt.items.add(f));
    if (inputRef.current) {
      inputRef.current.files = dt.files;
      if (nextFiles.length === 0) inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if(actionState.status === "SUCCESS"){
      previews.forEach((p) => URL.revokeObjectURL(p.url))
      setPreviews([])
      setFiles([])
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [actionState.status])

  return (
    <Form action={action} actionState={actionState} onSuccess={onSuccess}>
      <div className="flex flex-col items-center gap-2">
        <Input
          ref={inputRef}
          name="files"
          id="files"
          type="file"
          multiple
          accept={ACCEPTED.join(", ")}
          onChange={handleFileChange}
          className="w-full"
        />

        <span className=" text-sm">
          <span
            className={
              files.length === 0 ? "text-xs text-muted-foreground" : "text-xs"
            }
          >
            {fileStatus}
          </span>
        </span>

        <FieldError actionState={actionState} name="files" />
      </div>

      {previews.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            {previews.map((p, i) => (
              <div className="relative w-24 h-24" key={i}>
                <Button
                  type="button"
                  onClick={() => removeAtIndex(i)}
                  aria-label={`Remove ${p.name}`}
                  className="absolute -top-2 -right-2 rounded-full bg-opacity-0 hover:bg-opacity-0 cursor-pointer"
                >
                  <X className="h-2 w-2" />
                </Button>

                {isImage(p.type) ? (
                  <img
                    src={p.url}
                    alt={p.name}
                    className="h-full w-full object-cover rounded border bg-none"
                  />
                ) : (
                  <div className="h-full w-full rounded border text-[10px] flex items-center justify-center text-muted-foreground text-center px-1">
                    {p.name.endsWith(".pdf") ? "PDF" : p.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      { buttons || <SubmitButton label="Upload" />}
    </Form>
  );
};

export { AttachmentCreateForm };
