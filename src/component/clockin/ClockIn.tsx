import React, {useRef, useEffect, useState} from 'react';
import {
    Button,
    Tag,
    Space,
    PaginationProps, message, Modal
} from 'antd';
import ProList from '@ant-design/pro-list';
import ClockInAddAndUpdate from "./ClockInAddAndUpdate";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import store from "src/redux/Store"
import {Pages, R} from "src/utils/sysInterface";
import SweetUtils from "src/utils/utils";

export type ClockInType = {
    uName?: string,
    avatar?: string,
    cid?: string,
    clockInTime: string | Date
    health: number
    location: string
    remarks: string
    riskAreas: number
    status?: number
    suspected: number
    temperature: string
    uid?: string
}

type QueryType = {
    page: number,
    limit: number,
    order?: string,
    orderField?: string,
    start?: string,
    end?: string
}

interface PageProps extends PaginationProps {
    list?: ClockInType[]
}

export default function ClockIn ():JSX.Element {
    let clockAddRef = useRef<any>();
    const [clock, setClock] = useState<boolean>(false)
    const [pagination, setPagination] = useState<PageProps>({
        total: 0,
        pageSize: 15,
        current: 1,
        list: []
    })

    useEffect(() => {
        (async () => {
            await getClockInListByStudent({
                page: 1,
                limit: 15
            })
        })()
    }, [])

    const getClockInListByStudent =  async (query: QueryType) => {
        const {uid, avatar} = store.getState().userInfo
        const { data }: R<Pages<ClockInType>> = await instance.get(
            UrlDict.getClockInListByStudent+uid, {
                params: {
                    page: query.page,
                    limit: query.limit,
                    order: 'desc',
                    orderField: 'clock_in_time',
                    start: query.start || '',
                    end: query.end || ''
                }
            }
        )
        const { currPage, totalCount,pageSize, list } = data as Pages<ClockInType>
        setPagination({
            total: totalCount,
            pageSize: pageSize,
            current: currPage,
            list: list?.map((it:ClockInType) => {
                it.avatar = avatar
                it.temperature = parseFloat(it.temperature).toFixed(1)
                return it
            })
        })
        if (list) setClock(list?.some(it => it.clockInTime === SweetUtils.getLocalTime(new Date(), 'YYYY-mm-dd')))
    }

    const handleSubmit = async(e: any) => {
        const {clockInTime} = e
        await getClockInListByStudent({
            page: pagination.current as number,
            limit: pagination.pageSize as number,
            start: clockInTime ? clockInTime[0]:'',
            end: clockInTime ? clockInTime[1]:''
        })
    }
    return (
        <div style={{ padding: '30px 100px', backgroundColor: '#F5F5F5'}}>
            <ProList<ClockInType>
                toolBarRender={() => {
                    return [
                        <Button key="3" disabled={clock} onClick={ async () => {
                            clockAddRef!.current!.setIsModalVisible(true)
                        }} type="primary">
                            {clock?'今日已打卡':'健康打卡'}
                        </Button>
                    ];
                }}
                dataSource={pagination.list}
                search={{}}
                rowKey="name"
                headerTitle="健康打卡-记录"
                pagination={{
                    ...pagination,
                    onChange: async (page: number, pageSize?: number) => {
                        await getClockInListByStudent({
                            page: page,
                            limit: pageSize as number
                        })
                    }
                }}
                onSubmit={handleSubmit}
                showActions="always"
                metas={{
                    title: {
                        dataIndex: 'uname',
                        title: '用户',
                        search: false
                    },
                    avatar: {
                        dataIndex: 'avatar',
                        search: false
                    },
                    description: {
                        render: (_, row: ClockInType) => {
                            return <span>{row.remarks}</span>
                        },
                        search: false,
                    },
                    content: {
                        render: (text, row: ClockInType) => {
                            return <div>
                                <Tag color={row.health === 1 ? '' : 'red'} key="health">
                                     {row.health === 1 ? '健康状况正常': `健康异常--${row.temperature}℃`}
                                </Tag>
                                {row.riskAreas === 0 && (
                                    <Tag color={'red'} key="riskAreas">
                                        {'去过中高风险地区'}
                                    </Tag>
                                )}
                                {row.suspected === 0 && (
                                    <Tag color={'red'} key="suspected">
                                        {'接触过确诊或疑似病例'}
                                    </Tag>
                                )}
                            </div>
                        },
                        search: false
                    },
                    subTitle: {
                        dataIndex: 'clockInTime',
                        title: '打卡时间',
                        render: (_, row: ClockInType) => {
                            return (
                                <Space size={0}>
                                    <Tag color="#2db7f5" key={1}>
                                        {row.clockInTime}
                                    </Tag>
                                    <Tag color="#87d068" key={1}>
                                        {row.location}
                                    </Tag>
                                </Space>
                            );
                        },
                        valueType: 'dateRange',
                    },
                    actions: {
                        render: (text, row: ClockInType) => [
                            <Button
                                key="1"
                                type="link"
                                size={'small'}
                                disabled={!SweetUtils.isToday(row.clockInTime)}
                                onClick={ async () => {
                                    clockAddRef!.current!.setIsModalVisible(true, row)
                                }} >
                                {!SweetUtils.isToday(row.clockInTime)?'':'编辑'}
                            </Button>,
                            <Button
                                danger
                                key={'delete'}
                                type={'link'}
                                size={'small'}
                                disabled={!SweetUtils.isToday(row.clockInTime)}
                                onClick={() => {
                                    Modal.warning({
                                        content: `您确定要删除 【${row.clockInTime}】 的打卡记录吗？`,
                                        onOk: async () => {
                                            const {data}: R<boolean> = await instance.post(UrlDict.saveOrUpdateClockInById+'delete?cid='+row.cid)
                                            if (data) {
                                                message.success("删除成功")
                                                await getClockInListByStudent({
                                                    page: pagination.current as number,
                                                    limit: pagination.pageSize as number
                                                })
                                                return
                                            }
                                            message.error("删除失败")
                                        }
                                    });
                                }}>
                                {!SweetUtils.isToday(row.clockInTime)?'':'删除'}
                            </Button>
                        ],
                        search: false
                    }
                }}
            />
            <ClockInAddAndUpdate refresh={async () => {
                await getClockInListByStudent({
                    page: pagination.current as number,
                    limit: pagination.pageSize as number,
                })
            }} ref={clockAddRef} />
        </div>
    )
}
