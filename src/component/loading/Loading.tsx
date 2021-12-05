import React, {FC} from "react";
import {Spin} from "antd";
import './loading.less'
import {connect} from "react-redux";

type LoadingType = {loading: boolean}

const Loading: FC<LoadingType> = (props: Readonly<LoadingType>) => <Spin spinning={props.loading} className='loading-spin'/>

export default connect(
   ({loading}: LoadingType) => ({
       loading: loading
   })
)(Loading)
