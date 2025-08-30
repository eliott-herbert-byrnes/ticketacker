import { AttachmentEntity } from "@prisma/client";

export type PutFileParams = {
    organizationId: string;
    entity: AttachmentEntity;
    entityId: string;
    attachmentId:string;
    fileName: string;
    contentType?: string;
    body: ArrayBuffer | Uint8Array | Buffer | ReadableStream | NodeJS.ReadableStream | Blob | string;
}

export type PutFileResult = {
    location: string;
    key?: string;
    etag?: string;
}

export interface FileStorage {
    put(params: PutFileParams): Promise<PutFileResult>
}