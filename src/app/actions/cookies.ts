'use server'

import { cookies } from "next/headers"

// READ a cookie
export const getCookieByKey = async (key: string) => {
    const cookie = (await cookies()).get(key)

    if(!cookie) return null

    return cookie.value
}

// SET a cookie
export const setCookieByKey = async (key: string, value: string) => {
    (await cookies()).set(key, value)
}

// DELETE a cookie
export const deleteCookieByKey = async (key: string) => {
    (await cookies()).delete(key)
}