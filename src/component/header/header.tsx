import React, {FC} from "react";
import {Menu, Row, Col} from "antd";
import {Link} from "react-router-dom";
import './header.less'
import {Button} from "antd";
import MyRoute from "src/router/route";
import {User} from "src/utils/sysInterface";
import store from 'src/redux/Store'
import {loginOut} from "src/redux/actions/loginAction";
import UserUtils from "src/utils/user";

const MyHeader: FC = () => {
    const user: User = store.getState().userInfo
    const role = UserUtils.getRole();
    return (
        <div className="my-header">
            <Row>
                <Col span={4}>
                    <Link to={'/home/sweet'}>
                        <div className="logo"/>
                    </Link>
                </Col>
                <Col span={16}>
                    <Menu className='menu' theme="light" mode="horizontal">
                        {
                            MyRoute.filter(it => it.children)[0].children?.filter(it => it.show && (!it.role || it.role === role.rname)).map(it => (
                                <Menu.Item key={it.title}>
                                    <Link to={it.path}>{it.title}</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu>
                </Col>
                <Col span={4}>
                    <div className='login'>
                        { user !== null && (
                            <>
                                您好! {user.uname}
                                <Link to={'/login'}>
                                    <Button type="link" style={{'fontSize': "12px"}} onClick={() => {
                                        console.log("切换")
                                        store.dispatch(loginOut)
                                    }}>切换账户</Button>
                                </Link>
                            </>
                        ) }
                        { user === null && (
                            <>
                                您好像还没登录，请
                                <Link to={'/login'}>
                                    <Button type="link" style={{'fontSize': "12px"}}>登录</Button>
                                </Link>
                            </>
                        ) }
                    </div>
                </Col>
            </Row>
        </div>
    )
}
export default MyHeader
