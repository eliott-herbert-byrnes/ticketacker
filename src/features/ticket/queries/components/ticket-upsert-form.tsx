import { Ticket } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpsertTicket } from "@/features/actions/upsert-ticket";

type TicketUpsertFormProps = {
    ticket?: Ticket
}

const TicketUpsertForm = async ({ticket}: TicketUpsertFormProps) => {
    return (
        <form action={UpsertTicket.bind(null, ticket?.id)} className="flex flex-col gap-y-3">
            <Label htmlFor='title'>Title</Label>
            <Input id='title' name='title' type='text' defaultValue={ticket?.title}></Input>

            <Label htmlFor='content'>Content</Label>
            <Textarea id='content' name='content' defaultValue={ticket?.content}></Textarea>

            <Button type='submit' className="cursor-pointer">{ticket ? 'Edit' : 'Create'}</Button>
        </form>
    )
}

export { TicketUpsertForm };