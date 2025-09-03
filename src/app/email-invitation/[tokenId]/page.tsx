import { redirect } from "next/navigation";
import { organizationPath } from "@/app/paths";
import { CardCompact } from "@/components/card-compact";
import { getAuth } from "@/features/auth/queries/get-auth";
import { InvitationAcceptForm } from "@/features/invitation/components/invitation-accept-form";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/crypto";

type EmailInvitiationPageProps = {
  params: Promise<{
    tokenId: string;
  }>;
};

const EmailInvitiationPage = async ({ params }: EmailInvitiationPageProps) => {
  const { tokenId } = await params;

  const auth = await getAuth();
  const tokenHash = hashToken(tokenId);

  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash },
    select: { email: true, organizationId: true },
  });

  if (!invitation) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <CardCompact
          title="Invalid invitation"
          description="This invitation is invalid or has been revoked"
          className="w-full max-w-[420px] animate-fade-from-top"
          content={null}
        />
      </div>
    );
  }

  const signedInEmail = auth.user?.email?.toLowerCase();
  if (signedInEmail && signedInEmail === invitation.email.toLowerCase()) {
    const user = await prisma.user.findUnique({
      where: { email: invitation.email },
      select: { id: true },
    });
    if (user) {
      await prisma.$transaction([
        prisma.invitation.delete({ where: { tokenHash } }),
        prisma.membership.upsert({
          where: {
            membershipId: {
              organizationId: invitation.organizationId,
              userId: user.id,
            },
          },
          create: {
            organizationId: invitation.organizationId,
            userId: user.id,
            membershipRole: "MEMBER",
            isActive: false,
          },
          update: {},
        }),
      ]);
      redirect(organizationPath());
    } else {
      await prisma.invitation.update({
        where: { tokenHash },
        data: { status: "ACCEPTED_WITHOUT_ACCOUNT" },
      });
      redirect(organizationPath());
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <CardCompact
        title="Invitation to Organization"
        description="Accept the invitation to join the organization"
        className="w-full max-w-[420px] animate-fade-from-top"
        content={<InvitationAcceptForm tokenId={tokenId} />}
      />
    </div>
  );
};

export default EmailInvitiationPage;
