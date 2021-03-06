import React, {
    ForwardedRef,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import {Button, message, Modal, Tabs} from "antd";
import {Avatar, baseInstance, ClassEntity, CollegeType, Major} from "../sys";
import {R, Role, User} from "src/utils/sysInterface";
import ProForm, {ProFormInstance, ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {LockOutlined, MobileOutlined, UserOutlined} from "@ant-design/icons";
import instance from "src/request";
import UrlDict from "src/request/urlDict";

interface IProps {
    refresh: () => void
}

const AccountAddAndUpdate = forwardRef((props: IProps, ref: ForwardedRef<baseInstance<any>> ) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [roleList, setRoleList] = useState<Role[]>([])
    const [role, setRole] = useState<number>(4)
    const [majorList, setMajorList] = useState<Major[]>([])
    const [classList, setClassList] = useState<ClassEntity[]>([])
    const fieldLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    let userRef = useRef<ProFormInstance<User>>();
    useEffect(() => {
        (async () => {
            const {data}: R<Role[]> = await instance.get(UrlDict.getAllRole)
            await setRoleList(data as Role[])
        })()
    }, [])
    useImperativeHandle(ref, () =>({
        init: visible1 => {
            setVisible(visible1)
            userRef.current?.resetFields()
        }
    }))
    return (
        <Modal visible={visible}
               footer={[]}
               width={600}
               onCancel={() => {
                    setVisible(false)
                    userRef.current?.resetFields()
               }}>
            <Tabs defaultActiveKey={'4'} onChange={role => {
                setRole(parseInt(role))
                userRef.current?.resetFields()}}>
                {roleList.map(role => (
                    <Tabs.TabPane tab={role.rdesc} key={role.rid}/>
                ))}
            </Tabs>
            <ProForm
                formRef={userRef}
                layout='horizontal'
                {...fieldLayout}
                onFinish={async (e: any) => {
                    let baseUser = {
                        uname: e.uname,
                        avatar: Avatar[role-1],
                        username: e.username,
                        password: e.password,
                        phone: e.phone,
                        role: role,
                    }
                    if (role === 2) {
                        baseUser = Object.assign(baseUser, {
                            teaName: e.uname,
                            collegeId: e.collegeId,
                            caIds: JSON.stringify(e.caId)
                        })
                    }
                    if (role === 3) {
                        baseUser = Object.assign(baseUser, {
                            stuName: e.uname,
                            caId: e.caId,
                            claName: classList.find(it => it.caId === e.caId)?.claName
                        })
                    }
                    const {code}: R<null> = await instance.post(UrlDict.addUser, baseUser)
                    if (code && code===200) {
                        message.success("????????????")
                        setVisible(false)
                        props.refresh()
                    }
                }}
                submitter={{
                    render: () => (
                        <Button type="primary" size={'large'} htmlType="submit" block>??????</Button>
                    )
                }}>
                <ProFormText
                    label={'??????'}
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        max: 15,
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    name="username"
                    placeholder={'??????'}
                    rules={[{ required: true, message: '??????????????????'}]} />

                <ProFormText.Password
                    label={'??????'}
                    name="password"
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        max: 15,
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'??????'}
                    rules={[{ required: true, message: '??????????????????'}]}
                />
                <ProFormText.Password
                    label={'????????????'}
                    name="passwordAgain"
                    dependencies={['password']}
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        max: 15,
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'?????????????????????'}
                    rules={[{ required: true,  message: '?????????????????????'},
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('?????????????????????'));
                            },
                        }),
                    ]}
                />
                <ProFormText
                    label={'??????'}
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        min: 11,
                        max: 11,
                        prefix: <MobileOutlined className={'prefixIcon'} />,
                    }}
                    name="phone"
                    placeholder={'?????????'}
                />
                <ProFormText
                    label={'?????????'}
                    hasFeedback
                    fieldProps={{
                        max: 10,
                        size: 'large'
                    }}
                    name="uname"
                    placeholder={'?????????'}
                    rules={[{ required: true, message: '???????????????'}]}
                />
                {(role === 2 || role === 3) && (
                    <>
                        <ProFormSelect
                            label={'????????????'}
                            name={'collegeId'}
                            rules={[{required: true, message: '???????????????'}]}
                            request={async () => {
                                const {data}: R<CollegeType[]> = await instance.get(UrlDict.getCollegeList)
                                return data?.map(it => ({
                                    label: it.collegeName,
                                    value: it.coId,
                                    key: it.coId,
                                    majors: it.majors
                                })) as []
                            }}
                            fieldProps={{
                                onChange: (_, option: any) => setMajorList(option.majors)
                            }}/>
                        <ProFormSelect
                            label={'??????'}
                            name={'majorId'}
                            placeholder={'??????????????????'}
                            rules={role === 3?[{required: true, message: '???????????????'}]:[]}
                            options={majorList.map(it => ({
                                label: it.majorName,
                                value: it.maId,
                                key: it.maId,
                                list: it.classEntities
                            }))} fieldProps={{
                            onChange: (_, option: any) => setClassList(option.list)
                        }} />
                        <ProFormSelect
                            label={'????????????'}
                            name={'caId'}
                            placeholder={'??????????????????'}
                            mode={role===2?'tags':"single"}
                            rules={role===3?[{required: true, message: '???????????????'}]:[]}
                            options={classList.map(it => ({
                                label: it.claName,
                                value: it.caId,
                                key: it.caId
                            }))}
                        />
                    </>
                )}
            </ProForm>
        </Modal>
    )
})

export default AccountAddAndUpdate
