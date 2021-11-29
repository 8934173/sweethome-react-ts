import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {R} from "src/utils/sysInterface";
import { Progress, Tag, Tooltip, Button } from 'antd';
import {Avatar, baseInstance, ClassEntity, StudentClockIn} from "../sys/sys";
import {Tabs} from "antd";
import ProList from '@ant-design/pro-list';
import StudentClockInDetails from "./studentClockInDetails";
import store from 'src/redux/Store'
import SweetUtils from "../../utils/utils";
import {sendMessage} from "../../redux/actions/SocketAction";

export default function TeacherClockIn () {
    const [classList, setClassList] = useState<ClassEntity[]>();
    const ref = useRef<baseInstance<StudentClockIn>>();
    useEffect(() => {

        (async () => {
            const {data}: R<any> = await instance.get(UrlDict.getClockInByTeacher)
            if (data.length > 0) setClassList(data)
            console.log(data)

        })()
    }, [])
    return (
        <div style={{ padding: '30px 50px'}}>
            <Tabs>
                {classList?.map(it => (
                    <Tabs.TabPane tab={it.claName} key={it.caId}>
                        <ProList<StudentClockIn>
                            pagination={false}
                            // rowSelection={{}}
                            grid={{ gutter: 10, column: 3 }}
                            metas={{
                                title: {
                                    dataIndex: 'stuName'
                                },
                                subTitle: {
                                    render: (_, e: StudentClockIn)=> {
                                        return <Tag color={e.ClockInToday?'#5BD8A6':'purple'}>{e.ClockInToday?'今日已打卡':'今日还未打卡'}</Tag>
                                    }
                                },
                                type: {},
                                avatar: {},
                                content: {
                                    render: (_, row: StudentClockIn) => <Tooltip title="十五天打卡完成比"
                                                           color={'lime'}
                                                           placement="bottom">
                                        <Progress width={200} percent={row.clockPercentage as number} />
                                    </Tooltip>
                                },
                                actions: {
                                    render: (_, row: StudentClockIn) => [
                                        <Button key="run" type={'link'} disabled={row.ClockInToday} onClick={() => {
                                            const {uname} = store.getState().userInfo;
                                            store.dispatch(sendMessage(JSON.stringify({
                                                toUid: row.uid,
                                                message: `${uname}提醒您，今天赶紧打卡啦！`,
                                                time: SweetUtils.getLocalTime(new Date(), "YYYY-mm-dd HH:MM")})))
                                        }}>提醒</Button>,
                                        <Button key="delete" type={'link'} onClick={() => {
                                            ref.current?.init(true, row)
                                        }}>查看</Button>
                                    ]
                                },
                            }}
                            headerTitle="打卡情况"
                            dataSource={it.studentList?.map(it=> {
                                it.avatar = Avatar[2]
                                return it
                            }) as StudentClockIn[]}
                        />
                    </Tabs.TabPane>
                ))}
            </Tabs>
            <StudentClockInDetails ref={ref as MutableRefObject<any>}/>
        </div>
    )
}
