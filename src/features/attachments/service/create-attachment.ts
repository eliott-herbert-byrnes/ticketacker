
import { AttachmentEntity } from "@prisma/client";
import { fileStorage } from "@/infra/storage/s3-file-storage";
import { prisma } from "@/lib/prisma";
import * as attachmentData from "../data/";
import * as attachmentSubjectDTO from "../dto/attachment-subject-dto"

type CreateAttachmentsArgs = {
    subject: attachmentSubjectDTO.Type;
    entity: AttachmentEntity;
    entityId: string;
    files: File[];
}

export const createAttachments = async ({
  subject,
  entity,
  entityId,
  files,
}: CreateAttachmentsArgs) => {
  const attachments = [];
  let attachment: 
  | Awaited<ReturnType<typeof attachmentData.createAttachment>>
  | undefined;

  try {
    for (const file of files) {
    const body = Buffer.from(await file.arrayBuffer());

      attachment = await attachmentData.createAttachment({
        name: file.name,
        entity,
        entityId
      })

      attachments.push(attachment);

      const organizationId = subject.organizationId

      await fileStorage.put({
        organizationId,
        entity,
        entityId,
        fileName: file.name,
        attachmentId: attachment.id,
        contentType: file.type,
        body,
      })
    }
  } catch (error) {
    if (attachment) {
      await prisma.attachment.delete({
        where: {
          id: attachment.id,
        },
      });
    }

    throw error;
  }

  return attachments;
};