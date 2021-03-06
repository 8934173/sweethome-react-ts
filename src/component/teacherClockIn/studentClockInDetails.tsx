import React, {ForwardedRef, forwardRef, useImperativeHandle, useState} from "react";
import {Avatar, baseInstance, StudentClockIn} from "../sys/sys";
import {Drawer, PaginationProps, Space, Tag, Statistic} from "antd";
import {ClockInType} from "../clockin/ClockIn";
import {Pages, QueryType, R} from "../../utils/sysInterface";
import instance from "../../request";
import UrlDict from "../../request/urlDict";
import ProList from "@ant-design/pro-list";
import { StatisticCard } from '@ant-design/pro-card';

interface IProps {

}

interface PageProps extends PaginationProps {
    list?: ClockInType[]
}

const StudentClockInDetails = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<StudentClockIn>>) => {
    const [visible, setVisible] = useState(false);
    const [clockIn, setClockIn] = useState<StudentClockIn>()
    const [pagination, setPagination] = useState<PageProps>({
        total: 0,
        pageSize: 15,
        current: 1,
        list: []
    })

    const getClockInListByStudent =  async (query: QueryType, userid?:string) => {
        userid = userid || clockIn?.uid;
        const {data}: R<Pages<ClockInType>> = await instance.get(
            UrlDict.getClockInListByStudent+userid, {
                params: {
                    ...query,
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
                it.avatar = Avatar[2]
                it.temperature = parseFloat(it.temperature).toFixed(1)
                return it
            })
        })
    }

    useImperativeHandle(ref, () => ({
        init: (visible: boolean, data?: StudentClockIn) => {
            (async () => {
                await setClockIn(data)
                await getClockInListByStudent({
                    page: 1,
                    limit: 15
                }, data?.uid)
                await setVisible(visible)
            })()
        }
    }))
    return (
        <Drawer visible={visible} width={850} onClose={() => setVisible(false)}>
            <StatisticCard
                title={
                    <Space>
                        <span>??????????????????????????????</span>
                    </Space>
                }
                extra={<div>111</div>}
                statistic={{
                    value: `${clockIn?.count}???`,
                    prefix: '',
                    description: (
                        <Space size={30} style={{textAlign: 'center'}}>
                            <Statistic title="???????????????" value={clockIn?.clockPercentage+'%'} />
                            <Statistic title="????????????" value={clockIn?.target+"???????????????"} />
                        </Space>
                    ),
                }}
            />
            <ProList<ClockInType>
                toolBarRender={() => {
                    return [

                    ];
                }}
                dataSource={pagination.list}
                rowKey="name"
                headerTitle="????????????-??????"
                pagination={{
                    ...pagination,
                    onChange: async (page: number, pageSize?: number) => {
                        await getClockInListByStudent({
                            page: page,
                            limit: pageSize as number
                        })
                    }
                }}
                showActions="always"
                metas={{
                    title: {
                        dataIndex: 'uname',
                        title: '??????',
                    },
                    avatar: {
                        dataIndex: 'avatar',
                    },
                    description: {
                        render: (_, row: ClockInType) => {
                            return <span>{row.remarks}</span>
                        },
                    },
                    content: {
                        render: (text, row: ClockInType) => {
                            return <div>
                                <Tag color={row.health === 1 ? '' : 'red'} key="health">
                                    {row.health === 1 ? '??????????????????': `????????????--${row.temperature}???`}
                                </Tag>
                                {row.riskAreas === 0 && (
                                    <Tag color={'red'} key="riskAreas">
                                        {'????????????????????????'}
                                    </Tag>
                                )}
                                {row.suspected === 0 && (
                                    <Tag color={'red'} key="suspected">
                                        {'??????????????????????????????'}
                                    </Tag>
                                )}
                            </div>
                        },
                        search: false
                    },
                    subTitle: {
                        dataIndex: 'clockInTime',
                        title: '????????????',
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

                        ]
                    }
                }}
            />
        </Drawer>
    )
})

export default StudentClockInDetails
