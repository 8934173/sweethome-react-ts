import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {baseInstance, ClassEntity} from "../../sys/sys";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {R} from "src/utils/sysInterface";
import {Badge, Button, Card, Col, Form, Input, message, Modal, Row, Select, Space, Tabs,Result} from 'antd'
import {ActiveKey, Leave, LR, Revert, Status} from "../inout";
import {AxiosResponse} from "axios";
import {DeleteTwoTone, EyeTwoTone, SmileOutlined} from "@ant-design/icons";
import '../student/inout.less'
import {Detail} from "../Com";

const { Meta } = Card;

type Query = {
    type: ActiveKey,
    uname: string,
    auditStatus: string
}

export default function Inout (): JSX.Element {
    const [classList, setClassList] = useState<ClassEntity[]>([])
    const [list, setList] = useState<Leave[] | Revert[]>([])
    const [activeKey, setActiveKey] = useState<ActiveKey>("out")
    const [currentClassId, setCurrentClassId] = useState<string>("")
    const [currentDate, setCurrentDate] = useState<{[k: string]: any}>({})
    const [rejectVisible, setRejectVisible] = useState<boolean>(false)
    const detail = useRef<baseInstance<LR>>();
    const [form] = Form.useForm();
    const [reasonForm] = Form.useForm();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
    useEffect(() => {
        (() => {
            instance.get(UrlDict.getClassByTeacher).then(({data}: AxiosResponse<ClassEntity[]>) => {
                setClassList(data as ClassEntity[])
                setCurrentClassId(data[0].caId)
                getLeaveEntitiesByClassId(data[0].caId, 'out')
            })
        })()
    }, [])
    const getLeaveEntitiesByClassId = (caId: string, type: string, uname?: string, auditStatus?: string ) => {
        let url = type ==='out'? UrlDict.getLeaveEntitiesByClassId: UrlDict.getRevertEntitiesByClassId
        instance.get(url +caId, {
            params: {
                uname, auditStatus
            }
        }).then((res: any) => {
            const {list} = res as R<Leave[]>
            if (list) setList(list as Leave[])
        })
    }
    const update = async (data: any) => {
        let url = activeKey === 'out' ? UrlDict.updateLeave:UrlDict.updateRevert
        const {code}: R<null> = await instance.post(url, data)
        if (code===200) {
            getLeaveEntitiesByClassId(currentClassId, activeKey)
            message.success("????????????")
        }
    }
    return (
        <div style={{ padding: '30px 50px'}}>
            <Tabs onChange={(e: string) => {
                setCurrentClassId(e)
                form.resetFields()
                getLeaveEntitiesByClassId(e, activeKey)
            }}>
                {classList.map(it => (
                    <Tabs.TabPane tab={it.claName} key={it.caId} />
                ))}
            </Tabs>
            <div
                style={{padding: '20px 20px 0 20px', textAlign: "center"}}
            >
                <Form<Query>
                    form={form}
                    onFinish={async (e: Query) => {
                        setActiveKey(e.type)
                        const status = e.auditStatus==='-1'?undefined:e.auditStatus
                        getLeaveEntitiesByClassId(currentClassId, e.type, e.uname, status)
                    }}
                >
                    <Space size={'large'}>
                        <Form.Item label={'??????'} name={'uname'}>
                          <Input />
                        </Form.Item>
                        <Form.Item
                            label={'??????'}
                            name={'type'}
                            initialValue={'out'}>
                            <Select style={{width: 200}}>
                                <Select.Option value='out'>????????????</Select.Option>
                                <Select.Option value="in">????????????</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={'??????'}
                            name={'auditStatus'}
                            initialValue={'1'}>
                            <Select style={{width: 200}}>
                                <Select.Option value='-1'>??????</Select.Option>
                                <Select.Option value='0'>???????????????</Select.Option>
                                <Select.Option value="1">?????????</Select.Option>
                                <Select.Option value="2">????????????</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item style={{marginLeft: '200px', float: "right"}}>
                            <Space size={'middle'}>
                                <Button onClick={() => {
                                    form.resetFields()
                                }}>??????</Button>
                                <Button htmlType={'submit'}>??????</Button>
                            </Space>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
            <div className={'card-wrapper'}>
                <Row gutter={16}>
                    {(list as any[]).map(it => (
                        <Col span={6} key={it.inId || it.outId}>
                            <Badge.Ribbon text={Status[it.auditStatus as number].text} color={Status[it.auditStatus as number].tagColor}>
                                <Card
                                    className={'list-card'}
                                    size={'small'}
                                    cover={
                                        <div className={'card-cover'} style={{backgroundColor: Status[it.auditStatus as number].headerColor}}>
                                            {Status[it.auditStatus as number].text}
                                        </div>}
                                    actions={[
                                        <DeleteTwoTone twoToneColor={'#f50'} onClick={async () => {
                                            const id: string = it.inId || it.outId
                                            const url: string = activeKey==='out'?UrlDict.leaveDeleteOne:UrlDict.revertDeleteOne
                                            Modal.warning({
                                                content: '?????????????????????????????????',
                                                okText: '??????',
                                                cancelText: '??????',
                                                onOk: async () => {
                                                    await instance.post(url+id)
                                                    message.success('????????????!')
                                                    getLeaveEntitiesByClassId(currentClassId, activeKey)
                                                }
                                            })
                                        }}/>,
                                        <EyeTwoTone onClick={() => {
                                            detail.current?.init(true, it)
                                        }} />,
                                        <Button type={'text'} size={'small'} disabled={it.auditStatus!==1} onClick={async () => {
                                            const data = activeKey === 'out'? {
                                                outId: it.outId,
                                                auditStatus: 2
                                            } : {
                                                inId: it.inId,
                                                auditStatus: 2
                                            }
                                            await update(data)
                                        }}>??????</Button>,
                                        <Button type={'text'} size={'small'} disabled={it.auditStatus!==1} danger onClick={() => {
                                            setCurrentDate(it)
                                            setRejectVisible(true)
                                        }}>??????</Button>
                                    ]}>
                                    <Meta title={activeKey === 'in'?(it.estimateReturnTime + ' - ??????'): ((it.leaveTime || '0000-00-00') + ' - ??????')} description={<div>
                                        <Space size={[50, 10]} wrap>
                                            <span>{'?????????: '+ it.uname}</span>
                                            {it.teaId!==null && <span>{'?????????: ' + it.teaName}</span>}
                                            {it.remarks!==null && <div>{'???????????????: ' + it.remarks}</div>}
                                        </Space>
                                    </div>}/>
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    ))}
                </Row>
            </div>
            {list.length <= 0 && <Result
                icon={<SmileOutlined />}
                title="???????????????????????????..."
            />}
            <Modal
                visible={rejectVisible}
                width={500}
                onCancel={() => setRejectVisible(false)}
                okText={'??????'}
                cancelText={'??????'} onOk={() => {
                    reasonForm.submit()
            }}>
                <Form<{outReason: string}> form={reasonForm} {...layout} onFinish={async (e: {outReason: string}) => {
                    const data = activeKey === 'out'? {
                        outId: currentDate.outId,
                        auditStatus: 0,
                        ...e
                    } : {
                        inId: currentDate.inId,
                        auditStatus: 0,
                        ...e
                    }
                    await update(data)
                    setRejectVisible(false)
                }}>
                    <Form.Item label={'????????????'} name={'remarks'}>
                        <Input.TextArea showCount maxLength={50} />
                    </Form.Item>
                </Form>
            </Modal>

            <Detail activeKey={activeKey} ref={detail as MutableRefObject<any>} />
        </div>
    )
}
