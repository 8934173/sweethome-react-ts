import React, {FC} from "react";
import {Spin} from "antd";
import './loading.less'
import {connect} from "react-redux";

const Loading: FC = (props: Readonly<any>) => <Spin spinning={props.loading} className='loading-spin'/>

export default connect(
   ({loading}: any) => ({
       loading: loading
   })
)(Loading)
