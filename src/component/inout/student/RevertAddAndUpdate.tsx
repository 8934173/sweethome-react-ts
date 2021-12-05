import store from 'src/redux/Store'
import {Student, User} from "src/utils/sysInterface";
import React, {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";
import {DatePicker, Form, Input, message, Modal, Select} from "antd";
import {baseInstance} from "../../sys/sys";
import {Revert} from "../inout";
import moment from "moment";
import instance from "src/request";
import UrlDict from "src/request/urlDict";

interface IProps {
    refresh: () => void
}

const RevertAddAndUpdate = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<unknown>>) => {

    const [visible, setVisible] = useState<boolean>(false)
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };
    const [form] = Form.useForm();
    const user = store.getState().userInfo as User<Student>
    useImperativeHandle(ref,() => ({
        init: (visible: boolean) => {
            setVisible(visible)
            form.resetFields()
        }
    }))

    return (
        <Modal
            width={600}
            title="入校申请"
            visible={visible}
            okText={'确认'}
            cancelText={'取消'}
            onOk={() => form.submit()}
            onCancel={() => setVisible(false)}>
            <Form form={form} {...layout} onFinish={async (e: Revert) => {
                e.estimateReturnTime = e.estimateReturnTime?moment(e.estimateReturnTime).format("YYYY-MM-DD"):undefined
                e.classId = user.school?.caId as string
                e.stuId = user.school?.stuId
                await instance.post(UrlDict.applyForRevert, e)
                message.success("提交成功，请等待审核结果!")
                setVisible(false)
                props.refresh()}}>
                <Form.Item
                    label={'申请人'}
                    name={'uname'}
                    initialValue={user.uname}
                    rules={[{ required: true }]}>
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item
                    label={'所在班级'}
                    name={'classId'}
                    initialValue={user.school?.claName}
                    rules={[{ required: true }]}>
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item
                    label={'联系电话'}
                    name={'phone'}
                    rules={[{ required: true, message: '请输入联系电话'}]}>
                    <Input max={11} />
                </Form.Item>
                <Form.Item
                    label={'返校时间'}
                    name={'estimateReturnTime'}>
                    <DatePicker
                        style={{width: '200px'}}
                        placeholder='请选择返校时间'
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current < moment().startOf('day')} />
                </Form.Item>
                <Form.Item
                    label={'来源地'}
                    name={'departure'}
                    rules={[{ required: true, message: '请填写来源地'}]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label={'途径轨迹'}
                    name={'track'}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label={'目前健康状况'}
                    name={'health'}
                    initialValue={'正常'}>
                    <Select>
                        <Select.Option value="正常">正常</Select.Option>
                        <Select.Option value="发热,发烧">发热,发烧</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
})

export default RevertAddAndUpdate;
