import {LOADING} from "../constant";
import {Action} from "redux";

const INIT: boolean = false

export const loadingReducer = (preState = INIT, action: Action): boolean => action.type === LOADING
