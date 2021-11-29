import {FC, PropsWithChildren, useState, useRef, MutableRefObject, useEffect} from 'react'
import './login.less'
import { UserOutlined, LockOutlined  } from '@ant-design/icons';
import ProForm, {LoginForm, ProFormText, ProFormInstance} from '@ant-design/pro-form'
import instance from "src/request";
import {message, Image, Button} from 'antd';
import UrlDict from "src/request/urlDict";
import SweetUtils from "src/utils/utils";
import {User} from "src/utils/sysInterface";
import store from 'src/redux/Store'
import {saveToken, saveUserInfo} from "src/redux/actions/loginAction";
import {openSocket, closeSocket} from "src/redux/actions/SocketAction";

interface DataType{
    SWEET_HOME_TOKEN: string,
    userInfo: User
}

const Login: FC = (props: PropsWithChildren<any>) => {
    const [captcha, setCaptcha] = useState<string>(process.env.REACT_APP_SWEET + "/sys/captcha.jpg")
    const logo: string = require("src/assets/logo.png").default
    const ref: MutableRefObject<any> = useRef<MutableRefObject<ProFormInstance<User>>>()
    const onFinish = async (val:User) => {
        const { code, data }: {code: number, data: DataType} = await instance.post(UrlDict.login, SweetUtils.formData(val))
        if (code === 200) {
            store.dispatch(saveToken(data?.SWEET_HOME_TOKEN))
            store.dispatch(saveUserInfo(data?.userInfo))
            store.dispatch(openSocket())
            message.success('登录成功', 2)
            props.history.push('/home/sweet')
        }
    }

    useEffect(() => {
        store.dispatch(closeSocket())
    }, [])
    return (
        <div className="login-wrapper">
            <div className="form-wrapper">
                <LoginForm
                    formRef={ref}
                    onFinish={onFinish}
                    logo={logo}
                    submitter={{
                        render: () => (
                            <Button type="primary" size={'large'} htmlType="submit" block>{'登录'}</Button>
                        )
                    }}>
                    <ProFormText
                        hasFeedback
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'用户名'}
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    />
                    <ProFormText.Password
                        hasFeedback
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'密码'}
                        rules={[
                            {
                                required: true,
                                message: '请输入密码！',
                            },
                        ]}
                    />
                    <ProForm.Group>
                        <ProFormText
                            hasFeedback
                            className={"captcha-input"}
                            width={200}
                            name={'captcha'}
                            fieldProps={{
                                size: 'large'
                            }}
                            placeholder={'请输入验证码'}/>
                        <Image onClick={
                            () => setCaptcha(process.env.REACT_APP_SWEET + "/sys/captcha.jpg?uuid=" + SweetUtils.uuid())}
                               width={95}
                               height={35}
                               preview={false}
                               src={captcha}/>
                    </ProForm.Group>
                </LoginForm>
            </div>
        </div>
    )
}
export default Login
