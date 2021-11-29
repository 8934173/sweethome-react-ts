import {OP_SOCKET, CLOSE_SOCKET, SEND_MESSAGE} from "../constant";
import {Action} from "../constant";

export const openSocket = (): Action => ({type: OP_SOCKET})
export const closeSocket = (): Action => ({type: CLOSE_SOCKET})
export const sendMessage = (data: string) => ({type: SEND_MESSAGE, data})
