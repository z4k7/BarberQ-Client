export function isTokenExpired(token: string): boolean{
    const payload = JSON.parse(atob(token.split('.')[1]))

    if(payload?.exp){
        const expTime = payload.exp * 1000
        if (expTime > Date.now()) {
            return false
        }
        console.warn('token is expired')
        return true
    }
    console.warn("Token doesn't have expiration date")
    return false
}