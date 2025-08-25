"use server";
import { ticketPath } from "@/app/paths";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sizeInMB } from "../utils/size";
import { generateS3Key } from "../utils/generate-s3-key";
import { ACCEPTED, MAX_SIZE } from "../constants";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/aws";
import { AttachmentEntity, Prisma, PrismaClient } from "@prisma/client";
import { isComment, isTicket } from "../types";
import { getOrganizationIdByAttachment } from "../utils/attachment-helper";

const createAttachmentsSchema = z.object({
  files: z
    .custom<FileList>()
    .transform((files) => Array.from(files))
    .transform((files) => files.filter((file) => file.size > 0))
    .refine(
      (files) => files.filter((file) => sizeInMB(file.size) <= MAX_SIZE),
      `The maximum file size is ${MAX_SIZE}MB`
    )
    .refine(
      (files) => files.every((file) => ACCEPTED.includes(file.type)),
      "File type is not supported"
    )
    .refine((files) => files.length !== 0, "File is required"),
});

type CreateAttachmentArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

export const createAttachments = async (
  { entity, entityId }: CreateAttachmentArgs,
  _actionState: ActionState,
  formData: FormData
) => {
  const { user } = await getAuthOrRedirect();

  let subject;
  switch (entity) {
    case "TICKET": {
      subject = await prisma.ticket.findUnique({
        where: {
          id: entityId,
        },
      });
      break;
    }
    case "COMMENT": {
      subject = await prisma.comment.findUnique({
        where: {
          id: entityId,
        },
        include: {
          ticket: true,
        },
      });
      break;
    }
    default:
      return toActionState("ERROR", "Subject not found");
  }

  if (!subject) {
    return toActionState("ERROR", "Subject not found");
  }

  if (!isOwner(user, subject)) {
    return toActionState("ERROR", "Not the owner of this subject");
  }

  const Bucket = process.env.AWS_BUCKET_NAME;

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    const createdAttachments: { id: string; key: string }[] = [];
    const uploadedKeys: string[] = [];

    try {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());

        const data =
          entity === "TICKET"
            ? ({
                name: file.name,
                entity, 
                ticketId: entityId, 
              } satisfies Prisma.AttachmentUncheckedCreateInput)
            : ({
                name: file.name,
                entity, 
                commentId: entityId,
              } satisfies Prisma.AttachmentUncheckedCreateInput);

        const attachment = await prisma.attachment.create({ data });

        let organizationId = getOrganizationIdByAttachment(entity, subject);
        switch (entity) {
          case "TICKET": {
            if (isTicket(subject)) {
              organizationId = subject.organizationId;
            }
            break;
          }
          case "COMMENT": {
            if (isComment(subject)) {
              organizationId = subject.ticket.organizationId;
            }
            break;
          }
        }

        const key = generateS3Key({
          organizationId,
          entityId,
          entity,
          fileName: file.name,
          attachmentId: attachment.id,
        });

        await s3.send(
          new PutObjectCommand({
            Bucket,
            Key: key,
            Body: buffer,
            ContentType: file.type,
          })
        );

        createdAttachments.push({ id: attachment.id, key });
        uploadedKeys.push(key);
      }

      switch (entity) {
        case "TICKET":
          {
            if (isTicket(subject)) {
              revalidatePath(ticketPath(subject.id));
            }
          }
          break;
        case "COMMENT": {
          if (isComment(subject)) {
            revalidatePath(ticketPath(subject.ticket.id));
          }
          break;
        }
      }

      return toActionState("SUCCESS", "Attachments(s) uploaded");
    } catch (error) {
      await Promise.all(
        uploadedKeys.map((key) =>
          s3
            .send(new DeleteObjectCommand({ Bucket, Key: key }))
            .catch(() => null)
        )
      );

      await Promise.all(
        createdAttachments.map((a) =>
          prisma.attachment.delete({ where: { id: a.id } }).catch(() => null)
        )
      );

      return fromErrorToActionState(error);
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }
};
