import {
    SAVE_TOKEN,
    REMOVE_TOKEN,
    SAVE_USER_INFO,
    REMOVE_USER_INFO, LoginType, LOGIN, LOGIN_OUT
} from "../constant";
import {Action} from "../constant";
import {User} from 'src/utils/sysInterface'
import UserUtils from 'src/utils/user'

const token: string = UserUtils.getTokenByLocal()
export const tokenReducer = (preState = token, action: Action) => {
    const {type, data} = action
    if (type === SAVE_TOKEN) {
        if (typeof data === "string" && String(data).length > 0) {
            UserUtils.setTokenByLocal(data)
            return data
        }
    } else if (type === REMOVE_TOKEN) {
        UserUtils.removeTokenByLocal()
        return null
    }
    return UserUtils.getTokenByLocal()
}

const userInfo: User | null = UserUtils.getUserInfoByLocal()
export const userInfoReducer = (preState = userInfo, action: Action) => {
    const {type, data} = action
    if (type === SAVE_USER_INFO) {
        if (!data) return null
        UserUtils.setUserInfoByLocal(data as User)
        return UserUtils.getUserInfoByLocal()
    } else if (type === REMOVE_USER_INFO) {
        UserUtils.removeUserInfoByLocal()
        return null
    }
    return preState
}

export const loginReducer = (preState: LoginType, action: Action) => {
    const {type, user} = action
    if (type === LOGIN) {
        if (!user) return preState
        UserUtils.setUserInfoByLocal(user.userInfo)
        UserUtils.setTokenByLocal(user.SWEET_HOME_TOKEN)
        return user
    } else if (type === LOGIN_OUT) {
        UserUtils.removeTokenByLocal()
        UserUtils.removeUserInfoByLocal()
    }
    return null
}
