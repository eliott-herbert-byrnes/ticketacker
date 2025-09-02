import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getAttachmentUnique<
  TInclude extends Prisma.AttachmentInclude | undefined = undefined
>(id: string, include?: TInclude) {
  return prisma.attachment.findUnique({
    where: { id },
    include: include, 
  }) as Promise<Prisma.AttachmentGetPayload<{ include: TInclude }> | null>;
}

export async function getAttachmentSelect<
  TSelect extends Prisma.AttachmentSelect
>(id: string, select: TSelect) {
  return prisma.attachment.findUnique({
    where: { id },
    select: select,
  }) as Promise<Prisma.AttachmentGetPayload<{ select: TSelect }> | null>;
}
