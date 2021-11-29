import {User} from "../utils/sysInterface";

export const LOADING:string = 'loading';
export const UNLOADING:string = 'unloading'

export const SAVE_TOKEN:string = 'saveToken'
export const REMOVE_TOKEN:string = 'removeToken'

export const SAVE_USER_INFO:string = 'saveUserInfo';
export const REMOVE_USER_INFO: string = 'removeUserInfo'

export const LOGIN: string = 'login'
export const LOGIN_OUT: string = 'logout'

export const OP_SOCKET =  'openSocket'
export const CLOSE_SOCKET = 'closeSocket'
export const SEND_MESSAGE = 'sendMessage'

type dataType = string | object

export interface Action {
    type: string,
    data?: dataType,
    user?: LoginType
}

export interface LoginType {
    SWEET_HOME_TOKEN: string,
    userInfo: User
}
