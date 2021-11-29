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
                        message.success("添加成功")
                        setVisible(false)
                        props.refresh()
                    }
                }}
                submitter={{
                    render: () => (
                        <Button type="primary" size={'large'} htmlType="submit" block>提交</Button>
                    )
                }}>
                <ProFormText
                    label={'账号'}
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        max: 15,
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    name="username"
                    placeholder={'账号'}
                    rules={[{ required: true, message: '请输入账号！'}]} />

                <ProFormText.Password
                    label={'密码'}
                    name="password"
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        max: 15,
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'密码'}
                    rules={[{ required: true, message: '请输入密码！'}]}
                />
                <ProFormText.Password
                    label={'确认密码'}
                    name="passwordAgain"
                    dependencies={['password']}
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        max: 15,
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={'请再次输入密码'}
                    rules={[{ required: true,  message: '请再次输入密码'},
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次密码不匹配'));
                            },
                        }),
                    ]}
                />
                <ProFormText
                    label={'手机'}
                    hasFeedback
                    fieldProps={{
                        size: 'large',
                        min: 11,
                        max: 11,
                        prefix: <MobileOutlined className={'prefixIcon'} />,
                    }}
                    name="phone"
                    placeholder={'手机号'}
                />
                <ProFormText
                    label={'用户名'}
                    hasFeedback
                    fieldProps={{
                        max: 10,
                        size: 'large'
                    }}
                    name="uname"
                    placeholder={'用户名'}
                    rules={[{ required: true, message: '请输入姓名'}]}
                />
                {(role === 2 || role === 3) && (
                    <>
                        <ProFormSelect
                            label={'选择院系'}
                            name={'collegeId'}
                            rules={[{required: true, message: '请选择院系'}]}
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
                            label={'专业'}
                            name={'majorId'}
                            placeholder={'请先选择院系'}
                            rules={role === 3?[{required: true, message: '请选择专业'}]:[]}
                            options={majorList.map(it => ({
                                label: it.majorName,
                                value: it.maId,
                                key: it.maId,
                                list: it.classEntities
                            }))} fieldProps={{
                            onChange: (_, option: any) => setClassList(option.list)
                        }} />
                        <ProFormSelect
                            label={'绑定班级'}
                            name={'caId'}
                            placeholder={'请先选择专业'}
                            mode={role===2?'tags':"single"}
                            rules={role===3?[{required: true, message: '请选择班级'}]:[]}
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
