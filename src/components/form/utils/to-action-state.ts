import {z} from "zod"

export type ActionState = { 
    status?: "SUCCESS" | "ERROR",
    message: string, 
    fieldErrors: Record<string, string[] | undefined>,
    payload?: FormData ,
    timestamp: number
}

export const EMPTY_ACTION_STATE: ActionState = {
    message: "",
    fieldErrors: {},
    timestamp: Date.now()
}

export const fromErrorToActionState = (error: unknown, formData: FormData): ActionState => {
    if (error instanceof z.ZodError) {
        return {
            status: "ERROR",
            message: "",
            fieldErrors: error.flatten().fieldErrors,
            payload: formData,
            timestamp: Date.now()
        }
    } else if(error instanceof Error) {
        return {
            status: "ERROR",
            message: error.message, 
            fieldErrors: {},
            payload: formData,
            timestamp: Date.now()
        }
    }
    else {
        return {
            status: "ERROR",
            message: 'An unknown error occured', 
            fieldErrors: {},
            payload: formData,
            timestamp: Date.now()
        }   
    }
}

export const ToActionState = (status: ActionState['status'], message: string): ActionState => {
    return (
        { timestamp: Date.now(), status, message, fieldErrors: {} }
    )
}