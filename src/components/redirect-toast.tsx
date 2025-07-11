'use client'

import { useEffect } from "react"
import { toast } from "sonner"
import { deleteCookieByKey, getCookieByKey } from "@/app/actions/cookies"

const ReDirectToast = () => {

    useEffect(() => {
        const showCookieToast = async () => {
            const message = getCookieByKey('toast')
    
            if(message) {
                toast.success(message)
                deleteCookieByKey('toast')
            }
        }
        showCookieToast()
    }, [])

    return null
}

export {ReDirectToast}