import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import ProList from "@ant-design/pro-list";
import {Pages, QueryType, R, Teacher, User} from "src/utils/sysInterface";
import {Button, Modal, PaginationProps, Tag, Tabs, Form, Input, Space, Select, message} from "antd";
import ProCard from "@ant-design/pro-card";
import {baseInstance, ClassEntity} from "../sys";
import AccountAddAndUpdate from "./accountAddAndUpdate";

interface PageProps extends PaginationProps {
    list?: User[]
}
export default function Account (): JSX.Element {
    const [pagination, setPagination] = useState<PageProps>({
        total: 0,
        pageSize: 15,
        current: 1,
        list: []
    })
    const [classList, setClassList] = useState<ClassEntity[]>([])
    const ref = useRef<baseInstance<any>>();
    const [form] = Form.useForm();
    const metas = {
        title: {
            dataIndex: 'uname'
        },
        avatar: {},
        description: {
            render: (_: any, user: User) => {
                return `账号 : ${user.username} 电话: ${user.phone!==null?user.phone:'暂未绑定号码'}`
            }
        },
        subTitle: {
            render: (_: any, user: User) => {
                if (user.accountNonLocked&&user.accountNonExpired&&user.credentialsNonExpired&&user.enabled) {
                    return <Tag color="success" key={'1'}>账号正常</Tag>
                }
                if (!user.accountNonLocked) {
                    return <Tag color="error" key={'1'}>账号被锁定</Tag>
                }
                if (!user.enabled) {
                    return <Tag color="error" key={'1'}>账号被禁用</Tag>
                }
            }
        },
        actions: {
            render: (_: any, user: User) => [
                <Button
                    key="1"
                    type="link"
                    danger={!user.accountNonLocked}
                    size={'small'}
                    onClick={() => {
                        const {accountNonLocked, uid} = user
                        Modal.warning({
                            okText: '确定',
                            content: `您确定将要${accountNonLocked?'锁定':'解锁'}【${user.uname}】的账号吗？`,
                            onOk: async () => {
                                await instance.post(instance.adornData(UrlDict.lockOrUnlockAccount,{
                                    uid: uid,
                                    status: accountNonLocked?0:1
                                }))
                                message.success("操作成功!")
                                await getUserByAdmin({
                                    page: pagination.current as number,
                                    limit: pagination.pageSize as number,
                                })
                            }

                        });
                    }} >
                    {user.accountNonLocked?'锁定账号':'解除锁定'}
                </Button>,
                <Button
                    key="2"
                    type="link"
                    danger
                    size={'small'}
                    onClick={ async () => {
                        Modal.warning({
                            okText: '确定',
                            content: `您确定将要删除【${user.uname}】的账号吗？`,
                            onOk: async () => {
                                await instance.post(instance.adornData(UrlDict.deleteUserByAdmin, {
                                    uid: user.uid,
                                    role: user.role
                                }))
                                message.success("操作成功!")
                                await getUserByAdmin({
                                    page: pagination.current as number,
                                    limit: pagination.pageSize as number,
                                })
                            }
                        });
                    }} >
                    删除账号
                </Button>,
            ]
        }
    }

    useEffect(() => {
        (async () => {
            await getUserByAdmin({
                page: 1,
                limit: 15
            })
        })()
    }, [])

    const getUserByAdmin = async (pages: QueryType) => {
        const {data, code}: R<Pages<User>> = await instance.get(UrlDict.getUsersByAdmin, {
            params: {
                ...pages,
                order: 'asc',
                orderField: 'create_time',
            }
        })
        const { currPage, totalCount, pageSize, list } = data as Pages<User>
        if (code === 200) setPagination({
            total: totalCount,
            pageSize: pageSize,
            current: currPage,
            list: list
        })
    }

    return (
        <div style={{ padding: '30px 100px', backgroundColor: '#F5F5F5'}}>
            <div style={{ padding: '30px', backgroundColor: '#FFFFFF', marginBottom: '20px'}}>
                <Form form={form} layout="inline" onFinish={async(e) => {
                    await getUserByAdmin({
                        page: pagination.current as number,
                        limit: pagination.pageSize as number,
                        keyWords: e.uname,
                        status: e.status
                    })
                }}>
                    <Form.Item label={'用户名'} name='uname'>
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item label={'账号状态'} name='status'>
                        <Select style={{ width: 200 }} options={[
                            {
                                label: '正常',
                                value: 1
                            },
                            {
                                label: '被锁定',
                                value: 0
                            }
                        ]} />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit" >
                                查询
                            </Button>
                            <Button
                                type="default"
                                onClick={async() => {
                                    form.resetFields()
                                    await getUserByAdmin({
                                        page: pagination.current as number,
                                        limit: pagination.pageSize as number
                                    })
                                }}>
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            <ProCard split="vertical">
                <ProCard>
                    <ProList<User>
                        rowKey={'uid'}
                        headerTitle='用户列表'
                        dataSource={pagination.list}
                        toolBarRender={() => [
                            <Button key="3" type="primary" onClick={() => {
                                ref.current?.init(true)
                            }}>添加用户</Button>
                        ]}
                        onRow={(user: User) => ({
                            onClick: () => {
                                const a = user?.school as Teacher
                                if (a?.classEntities) {
                                    setClassList(a?.classEntities)
                                    return
                                }
                                setClassList([])
                            }
                        })}
                        pagination={{
                            ...pagination,
                            onChange: async (page: number, pageSize?: number) => {
                                await getUserByAdmin({
                                    page: page,
                                    limit: pageSize as number
                                })
                            }
                        }}
                        metas={metas}/>
                </ProCard>
                {classList.length>0 && <ProCard>
                  <Tabs tabPosition='top'>
                      {classList.map(it => {
                          return <Tabs.TabPane tab={it.claName} key={it.caId}>
                                {it.studentList && <ProList<User>
                                    rowKey={'uid'}
                                    headerTitle={'学生列表'}
                                    metas={metas}
                                    dataSource={it.studentList as User[]}/>
                                }
                          </Tabs.TabPane>
                      })}
                  </Tabs>
                </ProCard>}
            </ProCard>
            <AccountAddAndUpdate ref={ref as MutableRefObject<any>} refresh={async () => {
                await getUserByAdmin({
                    page: pagination.current as number,
                    limit: pagination.pageSize as number
                })
            }} />
        </div>
    )
}
