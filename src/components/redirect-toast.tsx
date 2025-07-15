'use client'

import { useEffect } from "react"
import { toast } from "sonner"
import { deleteCookieByKey, getCookieByKey } from "@/app/actions/cookies"

const ReDirectToast = () => {

    useEffect(() => {
        const showCookieToast = async () => {
            // READ cookie
            const message = await getCookieByKey('toast')
    
            if(message) {
                // SHOW toast
                toast.success(message)
                // CLEAN up
                await deleteCookieByKey('toast')
            }
        }
        showCookieToast()
    }, [])

    return null
}

export {ReDirectToast}