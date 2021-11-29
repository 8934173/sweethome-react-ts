import {LOADING} from "../constant";
import {Action} from "redux";

const INIT: boolean = false
// export const loadingReducer = (preState = INIT, action: Action): boolean => {
//     const {type} = action
//     if (!type) {
//         return preState
//     }
//     return type === LOADING
// }


export const loadingReducer = (preState = INIT, action: Action): boolean => action.type === LOADING
