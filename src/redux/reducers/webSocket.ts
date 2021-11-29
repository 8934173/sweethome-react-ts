import {message, Modal} from "antd";
import { OP_SOCKET, CLOSE_SOCKET, SEND_MESSAGE } from "../constant";
import UserUtils from 'src/utils/user'
import {Action} from "../constant";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {R} from "src/utils/sysInterface";
const {uid} = UserUtils.getUserInfoByLocal()!==null?UserUtils.getUserInfoByLocal(): {uid: ''}
const url = (process.env.REACT_APP_SWEET as string).replace("https","ws").replace("http","ws");
let socket = new WebSocket(url + "/clock/" + uid || '')

type SocketMessage = {
    uid: string,
    toUid: string,
    message: string,
    time: string
}

socket.onmessage = function (m:MessageEvent) {
    if (m.data!=null && m.data!=='') {
        const message = JSON.parse(m.data) as SocketMessage;
        Modal.info({
            okText: "去打卡",
            content: message.message,
            onOk: async () => {
                const {code}: R<null> = await instance.get(UrlDict.clockReceive + uid)
                if (code === 200) {
                    window.location.pathname = '/home/clockin'
                }
            }
        })
    }
}

socket.onopen = function () {
    console.log("连接成功")
}
socket.onclose = function (e) {
    console.log("断开连接")
}

export const webSocket = (preState = socket, action: Action) => {
    const {type, data} = action
    switch (type) {
        case OP_SOCKET:
            socket = new WebSocket(url + "/clock/" + uid || '')
            return socket;
        case CLOSE_SOCKET:
            preState.close()
            return null
        case SEND_MESSAGE:
            if (data && data !== ''){
                preState.send(data as string)
                message.success("已提醒该同学进行打卡")
            }
    }
    return preState
}
