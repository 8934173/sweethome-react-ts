export enum CodeStatus {
    VALID_EXCEPTION = 1000,
    UNKNOWN_EXCEPTION = 1001,
    CAPTCHA_EXCEPTION = 1002,
    SAVE_EXCEPTION = 1003,
    SUCCESS = 200,
    INVALID_TOKEN = 401,
    NO_AUTHORITY= 403
}

export enum CodeMessage {
    VALID_EXCEPTION = "填写格式不正确",
    UNKNOWN_EXCEPTION = "数据出错啦",
    SUCCESS = "获取数据成功",
    CAPTCHA_EXCEPTION = "验证码不正确",
    INVALID_TOKEN = "身份验证到期，请重新登录",
    NO_AUTHORITY = "您无权访问",
    SAVE_EXCEPTION = "保存失败"
}
