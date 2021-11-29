import React, {
    useRef,
    useEffect,
    useState, ForwardedRef
} from "react";
import {Button, message, Modal, Tooltip} from "antd";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {R} from "src/utils/sysInterface";
import type {baseInstance, ClassEntity, CollegeType, InitProps, Major} from '../sys'
import ProTable, {ProColumns} from '@ant-design/pro-table'
import ProCard from "@ant-design/pro-card";
import CollegeAddAndUpdate from './collegeAddAndUpdate'
import MajorAddAndUpdate from "./majorAddAndUpdate";
import ClassAddAndUpdate from "./classAddAndUpdate";

export default function College (): JSX.Element {

    const majorAddUpdateRef = useRef<baseInstance<any>>()
    const collegeAddUpdateRef = useRef<baseInstance<CollegeType>>()
    const classAddUpdateRef = useRef<baseInstance<InitProps>>()

    const [collegeList, setCollegeList] = useState<CollegeType[]>([]);
    const [major, setMajor] = useState<Major>()
    const [isExpand, setExpand] = useState<String>('')

    const collegeColumns: ProColumns<CollegeType>[] = [
        {
            title: '院系名字',
            dataIndex: 'collegeName',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center'
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            align: 'center',
            render: (_, row: CollegeType) => [
                <Button
                    key={'insert'}
                    type='link'
                    onClick={() => {
                        majorAddUpdateRef.current?.init(true, row)
                    }}>
                    添加专业
                </Button>,
                <Button
                    key={'update'}
                    type='link'
                    onClick={() => {
                        collegeAddUpdateRef.current?.init(true, row)
                    }}>
                    修改
                </Button>,
                <Tooltip
                    key={'delete'}
                    placement="top"
                    title={(row.majors && row.majors.length>0)?'请先删除该院系的所有专业':''}>
                    <Button
                        // disabled={row.majors && row.majors.length>0}
                        type='link'
                        danger
                        onClick={() => {
                            Modal.warning({
                                content: `您确定将要删除【${row.collegeName}】吗？`,
                                okText: '确定',
                                onOk: async () => {
                                    const {code}: R<null> = await instance.post(UrlDict.deleteCollege, {
                                        coId: row.coId
                                    })
                                    if (code===200) {
                                        message.success("删除成功")
                                        await getCollegeData()
                                    }
                                }
                            });
                        }}>
                        删除
                    </Button>
                </Tooltip>
            ],
        },
    ]
    const majorColumns: ProColumns<Major>[] = [
        {
            title: '专业',
            dataIndex: 'majorName',
            align: 'center',
            width: 350
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 350
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (_, row: Major) => [
                <Button
                    key={'insert'}
                    type='link'
                    onClick={() => {
                        classAddUpdateRef.current?.init(true,{
                            classEntity: {
                                collegeId: row.collegeId,
                                collegeName: row.collegeName,
                                majorId: row.maId,
                                majorName: row.majorName
                            } as ClassEntity,
                            majors: [{
                                maId: row.maId,
                                majorName: row.majorName
                            }] as Major[]
                        } , true)
                    }}>
                    添加班级
                </Button>,
                <Button
                    key={'update'}
                    type='link'
                    onClick={() => {
                        majorAddUpdateRef.current?.init(true, row, true)
                    }}>
                    修改
                </Button>,
                <Tooltip
                    key={'delete'}
                    placement="top"
                    title={row.classEntities&&'请先删除该专业下所有班级'}>
                    <Button
                        disabled={row.classEntities && row.classEntities.length>0}
                        type='link'
                        danger
                        onClick={() => {
                            Modal.warning({
                                content: `您确定将要删除【${row.majorName}】吗？`,
                                onOk: async () => {
                                    const {code}: R<null> = await instance.post(UrlDict.deleteMajor, {
                                        maId: row.maId
                                    })
                                    if (code === 200) {
                                        message.success("删除成功")
                                        await getCollegeData()
                                    }
                                }
                            });
                        }}>
                        删除
                    </Button>
                </Tooltip>
            ],
        },
    ]
    const classColumns: ProColumns<ClassEntity>[] = [
        {
            title: '班级名称',
            dataIndex: 'claName',
            align: 'center',
            width: 150
        },
        {
            title: '班主任',
            dataIndex: 'teacherName',
            align: 'center',
            width: 150,
            render: (_, row) => <span>{row.teacherName?row.teacherName:'暂未绑定班主任'}</span>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 150
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            align: 'center',
            width: 200,
            render: (_, row: ClassEntity) => [
                <Button
                    key={'update'}
                    type='link'
                    onClick={() => {
                        classAddUpdateRef.current?.init(true, {
                            classEntity: row,
                            majors: collegeList.find(it => row.collegeId === it.coId)!.majors
                        }, false)
                    }}>
                    修改
                </Button>,
                <Button
                    danger
                    key={'delete'}
                    type='link'
                    onClick={() => {
                        Modal.warning({
                            content: `您确定将要删除【${row.claName}】吗？`,
                            okText: '确定',
                            onOk: async () => {
                                const {code}: R<null> = await instance.post(UrlDict.deleteSchoolClass, {
                                    caId: row.caId,
                                    majorId: row.majorId,
                                    teacherId: row.teacherId||null
                                })
                                if (code === 200) message.success("删除成功")
                            }
                        });
                    }}>
                    删除
                </Button>,
            ]
        },
    ]

    useEffect(() => {
        (async () => {
            await getCollegeData()
        })()
    }, [])

    const getCollegeData = async() => {
        const {data}: R<CollegeType[]> = await instance.get(UrlDict.getCollegeList, {

        })
        if (data!=null && data.length > 0) {
            setCollegeList(data)
        }
    }

    return <div style={{ padding: '30px 100px', backgroundColor: '#F5F5F5'}}>
        <ProTable<CollegeType>
            rowKey={'coId'}
            search={false}
            pagination={false}
            options={false}
            columns={collegeColumns}
            dataSource={collegeList}
            headerTitle={"五道口职业技术学院"}
            toolBarRender={() => [
                <Button type="primary" onClick={() => {
                    collegeAddUpdateRef.current?.init(true)
                }}> 添加学院 </Button>
            ]}
            expandable={{
                indentSize: 30,
                onExpand: (e, record: CollegeType) => {
                    if (e && record.majors && record.majors.length>0) {
                        setMajor(record.majors[0])
                        setExpand(record.coId)
                    }
                },
                expandedRowKeys: [isExpand as string],
                expandedRowRender: (e: CollegeType) => {
                    if (e.majors && e.majors?.length > 0) {
                        return <ProCard split="vertical">
                            <ProCard
                                title={e.collegeName}
                                extra={
                                    <Button
                                        type='link'
                                        size={'small'}
                                        disabled
                                        onClick={() => {

                                        }}>
                                        {'点击专业查看班级信息'}
                                    </Button>}>
                                <ProTable<Major>
                                    scroll={{ x: 500 }}
                                    rowKey={'maId'}
                                    size={'small'}
                                    search={false}
                                    pagination={false}
                                    options={false}
                                    toolBarRender={false}
                                    columns={majorColumns}
                                    dataSource={e.majors}
                                    onRow={(record) => ({
                                        onClick: () => {
                                            setMajor(record)
                                        }
                                    })}
                                />
                            </ProCard>
                            <ProCard title={major?.majorName}>
                                {!major?.classEntities && (
                                    <div style={{textAlign: 'center'}}>
                                        <span>该专业下暂无班级信息 </span>
                                        <Button
                                            key={'insert'}
                                            type='link'
                                            onClick={() => {
                                                classAddUpdateRef.current?.init(true)
                                            }}>
                                            点击我添加~
                                        </Button>
                                    </div>
                                )}
                                {major && major?.classEntities?.length >= 1 && <ProTable<ClassEntity>
                                    rowKey={'caId'}
                                    size={'small'}
                                    search={false}
                                    pagination={false}
                                    options={false}
                                    toolBarRender={false}
                                    columns={classColumns}
                                    dataSource={major!.classEntities}
                                />}
                            </ProCard>
                        </ProCard>
                    }
                    return <div style={{textAlign: 'center'}}>
                        <span>院系下面暂无专业信息 </span>
                        <Button
                            key={'insert'}
                            type='link'
                            onClick={() => {
                                majorAddUpdateRef.current?.init(true)
                            }}>
                            点击我添加~
                        </Button>
                    </div>
                }
            }}/>
        <CollegeAddAndUpdate
            refresh={getCollegeData}
            ref={collegeAddUpdateRef as ForwardedRef<baseInstance<CollegeType>>} />
        <MajorAddAndUpdate
            list={collegeList}
            refresh={getCollegeData}
            ref={majorAddUpdateRef as ForwardedRef<baseInstance<any>>} />
        <ClassAddAndUpdate
            list={collegeList}
            refresh={getCollegeData}
            ref={classAddUpdateRef as ForwardedRef<baseInstance<InitProps>>} />
    </div>
}

