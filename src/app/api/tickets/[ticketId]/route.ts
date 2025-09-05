import * as credentialService from "@/features/credentials/service/authenticate-credentials";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import * as ticketCredentialService from "@/features/ticket/service/delete-by-credential";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);
  return Response.json(ticket);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;

  const bearer = request.headers.get("authorization") || "";
  const token = bearer.startsWith("Bearer ") ? bearer.slice(7) : "";

  try {
    const result = await ticketCredentialService.deleteByCredential({
      ticketId,
      token,
    });
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ticketCredentialService.NotFoundError) {
      return Response.json({ error: "Ticket not found" }, { status: 404 });
    }
    if (error instanceof credentialService.MissingScopeError) {
      return Response.json(
        { error: "Missing required scope" },
        { status: 403 }
      );
    }

    if (error instanceof credentialService.RevokedCredentialError) {
      return Response.json({ error: "Credential revoked" }, { status: 401 });
    }

    if (error instanceof credentialService.NotAuthorizedError) {
      return Response.json({ error: "Not authorized" }, { status: 401 });
    }
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
