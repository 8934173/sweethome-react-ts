import React, {
    ForwardedRef,
    forwardRef,
    useImperativeHandle,
    useState
} from "react";
import {
    Button,
    Form,
    Input, message,
    Modal,
    Select
} from "antd";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import type {
    baseInstance,
    CollegeType,
    Major
} from '../sys'
import {R} from "src/utils/sysInterface";


interface IProps {
    list: CollegeType[],
    refresh: () => void
}

const MajorAddAndUpdate = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<any>>):JSX.Element => {
    const [visible, setVisible] = useState<boolean>(false)
    const [isUnder, setUnder] = useState<boolean>(false)
    const [formRef] = Form.useForm<Major>();
    const list = props.list.map(it => {
        return {
            label: it.collegeName,
            value: it.coId
        }
    })
    useImperativeHandle(ref, () => ({
        init: (visible: boolean, data?: any, isUnder?: boolean) => {
            setVisible(visible)
            if (data && data.coId) {
                formRef.setFieldsValue({
                    collegeId: data.coId,
                    collegeName: data.collegeName
                })
            } else if (data && data.maId) {
                formRef.setFieldsValue({
                    collegeId: data.collegeId,
                    collegeName: data.collegeName,
                    maId: data.maId,
                    majorName: data.majorName
                })
            }
            if (isUnder!==undefined) setUnder(isUnder)
        },
    }))
    return (
        <>
            <Modal visible={visible}
                   footer={[]}
                   width={400}
                   onCancel={() => {
                       setVisible(false)
                       formRef.resetFields()
                   }}>
                <Form form={formRef}
                      layout={'vertical'}
                      onFinish={async (e: Major) => {
                          const {collegeName} = props.list.find(it => it.coId === e.collegeId) as CollegeType
                          const { code }: R<unknown> = await instance.post(UrlDict.saveMajor, Object.assign(e, {collegeName}))
                          if (code === 200) {
                              message.success(e.maId!==undefined?'修改成功':'添加成功')
                              props.refresh()
                          }
                          setVisible(false)
                      }}>
                    <Form.Item hidden={true} name={'maId'}>
                        <input/>
                    </Form.Item>
                    <Form.Item hidden={isUnder} label={'选择学院'} name={'collegeId'} rules={[{ required: true, message: '请先选择院系' }]}>
                        <Select showSearch options={list} />
                    </Form.Item>
                    <Form.Item name="majorName" label="专业名称" rules={[{ required: true, message: '专业名不能为空' }]}>
                        <Input max={15} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" block htmlType="submit">
                            确认
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
})

export default MajorAddAndUpdate
