import React, {ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {baseInstance, ClassEntity, CollegeType, InitProps, Major} from "../sys";
import {Button, Form, Input, message, Modal, Select} from "antd";
import {R, Teacher} from "src/utils/sysInterface";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {SelectValue} from "antd/es/select";

interface IProps {
    list: CollegeType[],
    refresh: () => void
}

type SelectVa = {label: string, value: string}[]
const ClassAddAndUpdate = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<InitProps>>) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [majorList, setMajorList] = useState<SelectVa>([]);
    const [teacherList, setTeacherList] = useState<Teacher[]>([])
    const [isUnder, setUnder] = useState<boolean>(false)
    const [formRef] = Form.useForm<ClassEntity>();
    useImperativeHandle(ref, () => ({
        init: (visible: boolean,data?: InitProps, isUnder?: boolean) => {
            if (data && data.majors) {
                setMajorList(data.majors.map(it => {
                    return {
                        label: it.majorName,
                        value: it.maId
                    }
                }))
            }
            if (data && data.classEntity) formRef.setFieldsValue(data.classEntity)
            if (isUnder!==undefined) setUnder(isUnder)
            setVisible(visible)
        }
    }))
    const list = props.list.map(it => {
        return {
            label: it.collegeName,
            value: it.coId
        }
    })
    useEffect(() => {
        (async () => {
            const { data }: R<Teacher[]> = await instance.get(UrlDict.getAllTeachers)
            if (data && data.length > 0) {
                setTeacherList(data)
            }
        })()
    }, [])
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
                      onFinish={async (e: ClassEntity) => {
                          const major = props.list.find(it => it.coId === e.collegeId)?.majors?.find(it => it.maId === e.majorId)
                          const {collegeId, collegeName, maId, majorName} = major as Major;
                          let teaName = null;
                          if(e.teacherId) {
                              teaName = (teacherList.find(it => it.teaId === e.teacherId) as Teacher).teaName
                          }
                          const res: R<any> = await instance.post(UrlDict.saveSchoolClass, {
                              caId: e.caId||null,
                              claName: e.claName,
                              collegeId: collegeId,
                              collegeName: collegeName,
                              majorId: maId,
                              majorName: majorName,
                              teacherId: e.teacherId||null,
                              teacherName: teaName
                          })
                          if (res.code === 200) {
                              message.success("添加成功")
                              setVisible(false)
                              props.refresh()
                              return
                          }
                          message.error(res.msg)
                      }}>
                    <Form.Item hidden={true} name={'caId'}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        hidden={isUnder}
                        label={'选择学院'}
                        name={'collegeId'}
                        rules={!isUnder?[{ required: true, message: '请先选择院系' }]:[]}>
                        <Select
                            options={list}
                            placeholder={'选择学院'}
                            onChange={(collegeId: SelectValue) => {
                                const c = (props.list.filter((it: CollegeType) => it.coId === collegeId)[0].majors)
                                    ?.map((it: Major) => {
                                        return {
                                            label: it.majorName,
                                            value: it.maId
                                        }
                                    }
                                )
                                setMajorList(c as SelectVa)
                            }} />
                    </Form.Item>
                    <Form.Item
                        hidden={isUnder}
                        label={'选择专业'}
                        name={'majorId'}
                        rules={!isUnder?[{ required: true, message: '请先选择院系'}]:[]}>
                        <Select
                            options={majorList}
                            placeholder={'请先选择院系'}
                             />
                    </Form.Item>
                    <Form.Item
                        label={'选择班主任'}
                        name={'teacherId'}>
                        <Select
                            allowClear
                            options={teacherList.map(it => {
                                return {
                                    value: it.teaId,
                                    label: it.teaName
                                }
                            })}
                            placeholder={'(可选)选择班主任'}
                        />
                    </Form.Item>
                    <Form.Item
                        label={'班级名称'}
                        name="claName"
                        rules={[{ required: true, message: '专业名不能为空' }]}>
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

export default ClassAddAndUpdate
