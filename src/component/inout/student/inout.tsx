import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {ActiveKey, Leave, LR, Revert, Status} from "../inout";
import {Button, message, Modal, Tabs, Badge, Card, Row, Col, Space, Form, Select} from "antd";
import {DeleteTwoTone, EyeTwoTone} from '@ant-design/icons'
import InAddAndUpdate from "./InAddAndUpdate";
import RevertAddAndUpdate from "./RevertAddAndUpdate";
import { baseInstance} from "../../sys/sys";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {R} from "src/utils/sysInterface";
import './inout.less'
import {Detail} from "../Com";

const { Meta } = Card;

export default function Inout (): JSX.Element {
    const inRef = useRef<baseInstance<unknown>>();
    const revert = useRef<baseInstance<unknown>>();
    const [activeKey, setActiveKey] = useState<ActiveKey>("out")
    const [list, setList] = useState<Leave[]|Revert[]>([])
    const [form] = Form.useForm();
    const detail = useRef<baseInstance<LR>>();
    useEffect(() => {
        (async () => {
            await getList<Leave>({})
        })()
    }, [])
    const getList = async function<T extends Leave| Revert>(query: {}, key?: string){
        key = key || 'out'
        const url = key==='out'?UrlDict.getLeaveEntitiesByStuId :UrlDict.getRevertEntitiesByStuId
        const {data, code}: R<T[]> = await instance.get(url, {
            params: {
                ...query
            }
        })
        if (code===200) setList(data as [])
    }
    return (
        <div style={{ padding: '30px 50px'}}>
            <Tabs defaultActiveKey="out" activeKey={activeKey} onChange={async (key: string) => {
                await setActiveKey(key as ActiveKey)
                await getList({}, key)
            }}>
                <Tabs.TabPane key='out' tab={'离校申请列表'}>
                </Tabs.TabPane>
                <Tabs.TabPane key='in' tab={'入校申请列表'} />
            </Tabs>
            <div
                style={{padding: '20px 20px 0 20px', textAlign: "center"}}
            >
                <Form
                    form={form}
                    onFinish={async (e: {[k: string]: string}) => {
                        await getList(e)
                    }}
                >
                    <Space size={'large'}>
                        <Form.Item
                            label={'状态'}
                            name={'auditStatus'}
                            initialValue={'1'}>
                            <Select style={{width: 200}}>
                                <Select.Option value='0'>审核未通过</Select.Option>
                                <Select.Option value="1">审核中</Select.Option>
                                <Select.Option value="2">审核通过</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item style={{marginLeft: '200px', float: "right"}}>
                            <Space size={'middle'}>
                                <Button>重置</Button>
                                <Button htmlType={'submit'}>查询</Button>
                                <Button type={'primary'} onClick={() => {
                                    revert.current?.init(true)
                                }}>返校申请</Button>
                                <Button type={'primary'} onClick={() => {
                                    inRef.current?.init(true)
                                }}>离校申请</Button>
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
                                                content: '您确定删除该条申请吗？',
                                                okText: '确定',
                                                cancelText: '取消',
                                                onOk: async () => {
                                                    console.log(id, it)
                                                    await instance.post(url+id)
                                                    message.success('删除成功!')
                                                    await getList({}, activeKey)
                                                }
                                            })
                                        }}/>,
                                        <EyeTwoTone onClick={() => {
                                            detail.current?.init(true, it)
                                        }} />,
                                    ]}>
                                    <Meta title={activeKey === 'in'?(it.estimateReturnTime + ' - 返校'): (it.leaveTime|| + ' - 离校')} description={<div>
                                        <Space size={[50, 10]} wrap>
                                            <span>{'申请人: '+ it.uname}</span>
                                            {it.teaId!==null && <span>{'审核人: ' + it.teaName}</span>}
                                            {it.remarks!==null && <div>{'审核人留言: ' + it.remarks}</div>}
                                        </Space>
                                    </div>}/>
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    ))}
                </Row>
            </div>
            <Detail activeKey={activeKey} ref={detail as MutableRefObject<any>} />
            <InAddAndUpdate refresh={async () => {
                setActiveKey("out")
                await getList({}, activeKey)
            }} ref={inRef as MutableRefObject<any>} />
            <RevertAddAndUpdate refresh={async () => {
                setActiveKey("in")
                await getList({}, activeKey)
            }} ref={revert as MutableRefObject<any>}/>
        </div>
    )
}
