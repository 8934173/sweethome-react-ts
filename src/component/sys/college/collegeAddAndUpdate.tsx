import React, {
    useImperativeHandle,
    forwardRef,
    useState, ForwardedRef
} from "react";
import {
    Form,
    Input,
    Modal,
    Button, message,
} from "antd";
import UrlDict from "src/request/urlDict";
import instance from "src/request";
import type {
    baseInstance,
    College, CollegeType
} from "../sys";
import {R} from "src/utils/sysInterface";

interface IProps {
    refresh: () => void
}

const CollegeAddAndUpdate = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<CollegeType>>) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [formRef] = Form.useForm<CollegeType>();

    useImperativeHandle(ref, () => ({
        init: (visible: boolean, data?: CollegeType) => {
            if (data) {
                formRef.setFieldsValue({
                    coId: data.coId,
                    collegeName: data.collegeName
                })
            }
            setVisible(visible)
        }
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
                      onFinish={async (e: College) => {
                          const {code}: R<null> = await instance.post(UrlDict.saveCollege, e)
                          if (code === 200) {
                              message.success(e.coId===undefined?'添加成功':'修改成功')
                              setVisible(false)
                              props.refresh()
                          }
                    }}>
                    <Form.Item hidden={true} name={'coId'}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="collegeName" label="学院名称" rules={[{ required: true }]}>
                        <Input />
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

export default CollegeAddAndUpdate
