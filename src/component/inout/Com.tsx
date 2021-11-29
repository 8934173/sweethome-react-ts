import {Descriptions, Modal} from "antd";
import React, {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";
import {ActiveKey, Leave, Revert} from "./inout";
import {baseInstance} from "../sys/sys";

interface IProps {
    activeKey: ActiveKey
}

type LR = Leave | Revert

const Detail = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<LR>>) => {

    const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
    const [currentDate, setCurrentDate] = useState<{[k: string]: any}>({})
    const activeKey = props.activeKey

    useImperativeHandle(ref, () => ({
        init: (visible: boolean, data?: LR) => {
            console.log(visible)
            setDrawerVisible(visible)
            setCurrentDate(data as LR)
        }
    }))

    return (
        <Modal visible={drawerVisible} width={750} onCancel={() => setDrawerVisible(false)} footer={[]}>
            <Descriptions title={activeKey === 'in'?(currentDate.estimateReturnTime + ' - 返校'): (currentDate.leaveTime + ' - 离校')}>
                <Descriptions.Item label="申请人">{currentDate.uname}</Descriptions.Item>
                <Descriptions.Item label="本人电话">{currentDate.phone}</Descriptions.Item>
                {activeKey === 'out' && <Descriptions.Item label={'监护人联系方式'}>{currentDate.parentPhone}</Descriptions.Item>}
                <Descriptions.Item label={activeKey === 'out'? '目的地': '来源地'}>{currentDate.destination || currentDate.departure}</Descriptions.Item>
                <Descriptions.Item label={'健康状况'}>{currentDate.health}</Descriptions.Item>
                {activeKey === 'out' && <Descriptions.Item label={'预计返校时间'}>{currentDate.estimateReturnTime}</Descriptions.Item>}
                <Descriptions.Item label="申请时间">{currentDate.createTime}</Descriptions.Item>
                <Descriptions.Item label="途径轨迹">{currentDate.track==null?'-':currentDate.track}</Descriptions.Item>
                {activeKey === 'out' && <Descriptions.Item label={'离校事由'}>{currentDate.outReason}</Descriptions.Item>}
                {currentDate.teaId !== null && <Descriptions.Item label={'审核人'}>{currentDate.teaName}</Descriptions.Item>}
                {currentDate.remarks !== null && <Descriptions.Item label={'审核备注'}>{currentDate.remarks}</Descriptions.Item>}
            </Descriptions>
        </Modal>
    )
})

export {Detail}
