type Handle = Function | null

export default class WS{

    param: any;

    reconnectCount: number

    socket: WebSocket | null

    taskRemindInterval: any

    isSuccess: boolean

    // webSocket?: WebSocket
    //
    baseConnectUrl = () => (process.env.REACT_APP_SWEET as string).replace("https","ws").replace("http","ws")
    //
    // constructor(url: string, protocols?: string | string[]) {
    //     this.webSocket = new WebSocket(this.baseConnectUrl + url);
    // }
    //
    // public onMessage(): string {
    //     if (this.webSocket !== null) {
    //         this.webSocket!.onmessage = function (msg: MessageEvent) {
    //             return msg.data
    //         }
    //     }
    //     return ''
    // }
    //
    // public open() {
    //
    // }
    constructor(param = {}) {
        this.param = param;
        this.reconnectCount = 0;
        this.socket = null;
        this.taskRemindInterval = null;
        this.isSuccess = true;
    }
    connection = () => {
        let {socketUrl, timeout = 0} = this.param;
        // 检测当前浏览器是什么浏览器来决定用什么socket
        if ('WebSocket' in window) {
            console.log('WebSocket');

            this.socket = new WebSocket(socketUrl);
        }
        else if ('MozWebSocket' in window) {
            console.log('MozWebSocket');
            // @ts-ignore
            this.socket = new MozWebSocket(socketUrl);
        }
        else {
            console.log('SockJS');
            // @ts-ignore
            this.socket = new SockJS(socketUrl);
        }
        if (this.socket !== null) {
            this.socket.onopen = this.onopen;
            this.socket.onmessage = this.onmessage;
            this.socket.onclose = this.onclose;
            this.socket.onerror = this.onerror;
            this.socket.send = this.sendMessage;
            this.socket.close = this.closeSocket;
        }
        // 检测返回的状态码 如果socket.readyState不等于1则连接失败，关闭连接
        if(timeout) {
            let time = setTimeout(() => {
                if(this.socket && this.socket.readyState !== 1) {
                    this.socket.close();
                }
                clearInterval(time);
            }, timeout);
        }
    };
    // 连接成功触发
    onopen = () => {
        let {socketOpen} = this.param;
        this.isSuccess=false  //连接成功将标识符改为false
        socketOpen && socketOpen();
    };
    // 后端向前端推得数据
    onmessage = (msg: MessageEvent) => {
        let {socketMessage} = this.param;
        socketMessage && socketMessage(msg);
        // 打印出后端推得数据
        console.log(msg);
    };
    // 关闭连接触发
    onclose = (e: any) => {
        this.isSuccess=true   //关闭将标识符改为true
        console.log('关闭socket收到的数据');
        let {socketClose} = this.param;
        socketClose && socketClose(e);
        // 根据后端返回的状态码做操作
        // 我的项目是当前页面打开两个或者以上，就把当前以打开的socket关闭
        // 否则就20秒重连一次，直到重连成功为止
        if(e.code==='4500' && this.socket !== null){
            this.socket.close();
        }else{
            this.taskRemindInterval = setInterval(()=>{
                if(this.isSuccess){
                    this.connection();
                }else{
                    clearInterval(this.taskRemindInterval)
                }
            },20000)
        }
    };
    onerror = (e: Event) => {
        // socket连接报错触发
        let {socketError} = this.param;
        this.socket = null;
        socketError && socketError(e);
    };
    sendMessage = (value: string) => {
        // 向后端发送数据
        if(this.socket) {
            this.socket.send(JSON.stringify(value));
        }
    };
    closeSocket(code?: number, reason?: string) {

    }
}
