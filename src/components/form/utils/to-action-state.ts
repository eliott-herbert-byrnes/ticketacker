import {z} from "zod"

export type ActionState = { 
    message: string, 
    fieldErrors: Record<string, string[] | undefined>,
    payload?: FormData 
}

export const fromErrorToActionState = (error: unknown, formData: FormData): ActionState => {
    if (error instanceof z.ZodError) {

        return {
            message: "",
            fieldErrors: error.flatten().fieldErrors,
            payload: formData
        }
    } else if(error instanceof Error) {
        return {
            message: error.message, 
            fieldErrors: {},
            payload: formData
        }
    }
    else {
        return {
            message: 'An unknown error occured', 
            fieldErrors: {},
            payload: formData
        }   
    }
}