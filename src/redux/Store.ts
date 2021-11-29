import {createStore, combineReducers} from "redux";
import {loadingReducer} from "./reducers/loadingReducer";
import {loginReducer, tokenReducer, userInfoReducer} from "./reducers/loginReducer";
import { webSocket } from "./reducers/webSocket";

// @ts-ignore
// const moduleFiles: any = require.context('./reducers', true, /.ts$/)
// moduleFiles().keys().map(it => moduleFiles(it))

export default createStore(
    combineReducers({
        loading: loadingReducer,
        token: tokenReducer,
        userInfo: userInfoReducer,
        user: loginReducer,
        clockSocket: webSocket
    })
)
