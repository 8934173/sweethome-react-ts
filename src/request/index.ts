import axios, {AxiosInstance, AxiosRequestConfig, CancelTokenStatic, Method} from "axios";
import {CodeStatus, CodeMessage} from "./codeStatus"
import store from 'src/redux/Store'
import {loading, unloading} from "src/redux/actions/loadingAction";
import {Modal, message} from "antd";
import {removeToken, removeUserInfo} from "src/redux/actions/loginAction";
import qs from 'qs'
import {R} from "../utils/sysInterface";

interface MyAxiosInstance extends AxiosInstance {
    adornData: (url: string, data: any) => any
}



interface PendingType{
    url?: string
    method?: Method
    params: any
    data: any
    cancel: Function
}

//取消重复请求
const pending: Array<PendingType> = []
const CancelToken: CancelTokenStatic = axios.CancelToken

// axios实例
const instance = axios.create({
    baseURL: '/sweet',
    timeout: 10000,
    responseType: "json",
}) as MyAxiosInstance

/**
 * 防止提交多次的重复请求
 * @param config
 */
const removePending = (config: AxiosRequestConfig) => {
    for (let key in pending) {
        let it: number = +key
        let list: PendingType = pending[key]
        //当前请求在数组中存在时执行函数体
        if (list.url === config.url && list.method === config.method && JSON.stringify(list.data) === JSON.stringify(config.data)) {
            list.cancel('操作频繁，请稍后再试')
            //从数组中移除记录
            pending.splice(it, 1)
        }
    }
}

instance.interceptors.request.use(
    (request: AxiosRequestConfig) => {
        if (store.getState().token !== null) {
            request.headers['Authentication'] = store.getState().token
        }
        store.dispatch(loading)
        removePending(request)
        request.cancelToken = new CancelToken(c => {
            pending.push({ url: request.url, method: request.method, params: request.params, data: request.data, cancel: c })
        })
        return request
    },
    error => {
        store.dispatch(unloading)
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        const {code, msg}: R<any> = response?.data
        switch (code) {
            case CodeStatus.INVALID_TOKEN:
                Modal.error({
                    title: "登录失败",
                    content: CodeMessage.INVALID_TOKEN,
                    onOk() {
                        store.dispatch(removeToken())
                        store.dispatch(removeUserInfo)
                        window.location.pathname = '/login'
                    }
                })
                break
            case CodeStatus.VALID_EXCEPTION:
                message.error(CodeMessage.VALID_EXCEPTION).then()
                break
            case CodeStatus.NO_AUTHORITY:
                Modal.error({
                    title: "权限不足",
                    content: CodeMessage.NO_AUTHORITY,
                    onOk() {
                        window.location.pathname = '/home/noAccess'
                    }
                })
                break
            case CodeStatus.UNKNOWN_EXCEPTION:
                message.error(msg|| CodeMessage.UNKNOWN_EXCEPTION)
                break
            case CodeStatus.CAPTCHA_EXCEPTION:
                message.error(CodeMessage.CAPTCHA_EXCEPTION)
                break
            case CodeStatus.SAVE_EXCEPTION:
                message.error(CodeMessage.SAVE_EXCEPTION)
                break
            case CodeStatus.SUCCESS:
                store.dispatch(unloading)
                return response.data
            default:
                break
        }
        store.dispatch(unloading)
        return response
    },
    error => {
        const response = error.response
        //超时重新请求
        // const config = error.config
        // //默认超过三次就不再发送请求
        // const [RETRY_COUNT, RETRY_DELAY] = [3, 1000]
        // if (config && RETRY_COUNT) {
        //     config._retryCount = config._retryCount || 0
        //     if (config._retryCount >= RETRY_COUNT) {
        //         return Promise.reject(response|| {message: error.message})
        //     }
        //     config._retryCount++
        //     return new Promise(() => {
        //         setTimeout(() => {
        //             return instance(config)
        //         }, RETRY_DELAY || 1)
        //     })
        // }
        store.dispatch(unloading)
        return Promise.reject(response || {message: error.message});
    }
)

instance.adornData = (url: string, data = {}) => {
    return url+"?"+ qs.stringify(data)
}

export default instance
