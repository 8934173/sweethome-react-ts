import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import reportWebVitals from './reportWebVitals';
import MyRoute from "./router/route";
import {BrowserRouter, Route} from "react-router-dom";
import {Provider} from "react-redux";
import store from 'src/redux/Store'

ReactDOM.render(
    // <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Suspense fallback={<div>55</div>}>
                    {
                        MyRoute.map((it, index) => {
                            if (it.children && it.children.length > 0) {
                                return (
                                    <React.Fragment key={index}>
                                        <Route
                                            path={it.path}
                                            exact={it.exact}
                                            render={props => {
                                                return (<it.component {...props} children={it.children}/>)
                                            }}
                                        />
                                    </React.Fragment>
                                )
                            } else {
                                return (
                                    <React.Fragment key={index}>
                                        <Route path={it.path} exact={it.exact} component={it.component} />
                                    </React.Fragment>
                                )
                            }
                        })
                    }
                </Suspense>
            </BrowserRouter>
        </Provider>,
    // </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
