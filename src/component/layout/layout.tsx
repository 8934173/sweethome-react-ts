import React, {FC, PropsWithChildren, Suspense, useEffect} from 'react';
import {Layout} from "antd";
import MyHeader from "../header/header";
import {Route} from "react-router-dom";
import Loading from "../loading/Loading";
const { Header, Content } = Layout;

const MyLayout: FC = (props:PropsWithChildren<any>) => {

    useEffect(() => {
        const {location} = props
        if (location.pathname === '/') {
            props?.history.push("/home/sweet")
        }
    })

    let children: object[] = (props.children?props.children:[]) as Array<object>
    return (
        <div className="App">
            <Header style={{'background': '#fff'}}>
                <MyHeader />
            </Header>
            <Content>
                <Loading />
                <Suspense fallback={<div></div>}>
                    {
                        Array.from(children).map((it: any, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <Route path={it.path} exact={it.exact} component={it.component}/>

                                </React.Fragment>
                            )
                        })
                    }
                </Suspense>
            </Content>
        </div>
    )
}
export default MyLayout;
