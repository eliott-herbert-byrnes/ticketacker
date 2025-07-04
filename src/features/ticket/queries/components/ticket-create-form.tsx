import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTicket } from "@/features/actions/create-ticket";


const CreateTicketForm = async () => {
    return (
        <form action={createTicket} className="flex flex-col gap-y-3">
            <Label htmlFor='title'>Title</Label>
            <Input id='title' name='title' type='text'></Input>

            <Label htmlFor='content'>Content</Label>
            <Textarea id='content' name='content'></Textarea>

            <Button type='submit' className="cursor-pointer">Create</Button>
        </form>
    )
}

export { CreateTicketForm };