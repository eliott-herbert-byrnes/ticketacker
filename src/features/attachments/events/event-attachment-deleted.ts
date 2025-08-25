import { s3 } from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "../utils/generate-s3-key";
import { AttachmentEntity } from "@prisma/client";

export type AttachmentDeleteEventArgs = {
  data: {
    attachmentId: string;
    organizationId: string;
    entityId: string;
    entity: AttachmentEntity;
    fileName: string;
  };
};

export const attachmentDeletedEvent = inngest.createFunction(
  { id: "attachment-deleted" },
  { event: "app/attachment.deleted" },
  async ({ event }) => {
    const { organizationId, entity, entityId, fileName, attachmentId } = event.data;

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId: organizationId,
            entityId,
            entity,
            fileName: fileName,
            attachmentId: attachmentId,
          }),
        })
      );
    } catch (error) {
      console.log(error);
      return { event, body: false };
    }
    return { event, body: true };
  }
);
