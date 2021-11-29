import {
    SAVE_TOKEN,
    REMOVE_TOKEN,
    SAVE_USER_INFO,
    REMOVE_USER_INFO,
    LOGIN,
    LOGIN_OUT,
    Action, LoginType
} from "../constant";
import {User} from "../../utils/sysInterface";

export const saveToken = (data: string): Action => ({type: SAVE_TOKEN, data});
export const removeToken = () => ({type: REMOVE_TOKEN})

export const saveUserInfo = (data: User):Action => ({type: SAVE_USER_INFO, data})
export const removeUserInfo: Action = {type: REMOVE_USER_INFO}

export const login = (user: LoginType):Action => ({type: LOGIN, user})
export const loginOut: Action = ({type: LOGIN_OUT})
