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
        console.log(data)
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
                        <span>截止今日连续打卡天数</span>
                    </Space>
                }
                extra={<div>111</div>}
                statistic={{
                    value: `${clockIn?.count}天`,
                    prefix: '',
                    description: (
                        <Space size={30} style={{textAlign: 'center'}}>
                            <Statistic title="实际完成度" value={clockIn?.clockPercentage+'%'} />
                            <Statistic title="当前目标" value={clockIn?.target+"天连续打卡"} />
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
                showActions="always"
                metas={{
                    title: {
                        dataIndex: 'uname',
                        title: '用户',
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

                        ]
                    }
                }}
            />
        </Drawer>
    )
})

export default StudentClockInDetails
