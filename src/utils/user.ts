import {Role, User as UserType} from './sysInterface'

/**
 * 用户信息的一些基本操作
 */
export default class UserUtils {

    private static USER_INFO = 'userInfo'

    private static TOKEN = 'Authentication'

    public static removeUserInfoBySession = ():void => sessionStorage.removeItem(this.USER_INFO)

    public static removeUserInfoByLocal = ():void => localStorage.removeItem(this.USER_INFO)

    public static removeTokenBySession = ():void => sessionStorage.removeItem(this.TOKEN)

    public static removeTokenByLocal = ():void => localStorage.removeItem(this.TOKEN)

    public static setUserInfoBySession(user: UserType){
        sessionStorage.setItem(this.USER_INFO, JSON.stringify(user))
    }

    public static setUserInfoByLocal(user: UserType){
        localStorage.setItem(this.USER_INFO, JSON.stringify(user))
    }

    public static setTokenBySession(token: string){
        localStorage.setItem(this.TOKEN, token)
    }


    public static setTokenByLocal(token: string){
        localStorage.setItem(this.TOKEN, token)
    }

    public static getUserInfoBySession(): UserType {
        return JSON.parse(sessionStorage.getItem(this.USER_INFO) as string)
    }

    public static getUserInfoByLocal(): UserType {
        return JSON.parse(localStorage.getItem(this.USER_INFO) as string)
    }

    public static getTokenBySession(): string {
        return (sessionStorage.getItem(this.TOKEN) as string)
    }

    public static getTokenByLocal(): string {
        return (localStorage.getItem(this.TOKEN) as string)
    }

    public static getRole(): Role {
        return this.getUserInfoByLocal().roles[0]
    }
}
