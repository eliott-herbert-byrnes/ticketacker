
import { PutObjectCommand, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import type { FileStorage, PutFileParams, PutFileResult } from "@/features/attachments/ports/file-storage";
import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import { s3 } from "@/lib/aws";

export class S3FileStorage implements FileStorage {
    private bucket = process.env.AWS_BUCKET_NAME!;

    async put(params: PutFileParams): Promise<PutFileResult> {
        const key = generateS3Key({
            organizationId: params.organizationId,
            entityId: params.entityId,
            entity: params.entity,
            fileName: params.fileName,
            attachmentId: params.attachmentId
        })

        const input: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: key,
            Body: params.body as PutObjectCommandInput["Body"],
            ContentType: params.contentType,
        }

        const out = await s3.send(new PutObjectCommand(input))
        const etag = out.ETag?.replace(/"/g, "");

        return {
            location: `s3://${this.bucket}/${key}`,
            key,
            etag,
        }
    }
}

export const fileStorage = new S3FileStorage();