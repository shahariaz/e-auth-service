export type THttpResponse = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
}

export type THttpErrorResponse = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method?: string
        url?: string
    }
    message: string
    data: unknown
    trace?: object | null
}
export type AuthCookie = {
    accessToken: string
    refreshToken: string
}
