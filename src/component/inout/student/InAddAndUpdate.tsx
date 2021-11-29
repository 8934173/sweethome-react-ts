import React, {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";
import {baseInstance, } from "../../sys/sys";
import {DatePicker, Form, Input, message, Modal, Select} from "antd";
import store from 'src/redux/Store'
import {Student, User} from "src/utils/sysInterface";
import moment from 'moment';
import {Leave} from "../inout";
import instance from "src/request";
import UrlDict from "src/request/urlDict";

interface IProps {
    refresh: () => void
}

const InAddAndUpdate = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<unknown>>) => {

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

    return <>
        <Modal
            width={600}
            title="离校申请"
            visible={visible}
            okText={'确认'}
            cancelText={'取消'}
            onOk={() => form.submit()}
            onCancel={() => setVisible(false)}
        >
            <Form form={form} {...layout}
                  onFinish={async (e: Leave) => {
                    e.leaveTime = moment(e.leaveTime).format("YYYY-MM-DD")
                    e.estimateReturnTime = e.estimateReturnTime?moment(e.estimateReturnTime).format("YYYY-MM-DD"):undefined
                    e.classId = user.school?.caId as string
                    e.stuId = user.school?.stuId
                    await instance.post(UrlDict.applyForLeaving, e)
                    message.success("提交成功，请等待审核结果!")
                    setVisible(false)
                    props.refresh()
                  }}
            >
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
                    label={'监护人电话'}
                    name={'parentPhone'}
                    rules={[{required: true, max: 11, min: 11, message: '电话格式不正确'}]}>
                    <Input max={11} />
                </Form.Item>
                <Form.Item
                    label={'离校时间'}
                    name={'leaveTime'}
                    rules={[{ required: true, message: '请选择离校时间'}]}>
                    <DatePicker
                        style={{width: '200px'}}
                        placeholder='请选择离校时间'
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current < moment().startOf('day')}/>
                </Form.Item>
                <Form.Item
                    label={'预计返校时间'}
                    name={'estimateReturnTime'}>
                    <DatePicker
                        style={{width: '200px'}}
                        placeholder='请选择预计返校时间'
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current < moment().startOf('day')} />
                </Form.Item>
                <Form.Item
                    label={'目的地'}
                    name={'destination'}
                    rules={[{ required: true, message: '请选择离校时间'}]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label={'预计途径轨迹'}
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
                <Form.Item
                    label={'外出事由'}
                    name={'outReason'}>
                    <Input.TextArea showCount maxLength={50} />
                </Form.Item>
            </Form>
        </Modal>
    </>
})
export default InAddAndUpdate
