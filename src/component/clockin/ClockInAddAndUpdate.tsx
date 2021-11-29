import React, {forwardRef, useImperativeHandle, useRef, useState, useEffect} from 'react';
import type {ProFormInstance} from "@ant-design/pro-form";
import ProForm, {
    ProFormText,
    ProFormDatePicker,
    ProFormRadio,
    ProFormSelect,
    ProFormTextArea
} from "@ant-design/pro-form";
import {Button, message, Modal} from "antd";
import SweetUtils from "src/utils/utils";
import store from 'src/redux/Store'
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {R, User} from "src/utils/sysInterface";
import {ClockInType} from "./ClockIn";

interface RefInit {
    setIsModalVisible: Function,
}

interface FormParams{
    cid?: string,
    uid?: string,
    name?: string,
    uname?: string,
    clockInTime: Date | string,
    temperature: string,
    health: string | number,
    location: string,
    riskAreas: string | number,
    remarks: string,
    suspected: string | number,
    status?: number
}

type OptionType = {
    label: string,
    value: number
}

type AddressType = {
    address: string
    address_detail: AddressDetail,
    point: {
        x: string,
        y: string
    }
}

type AddressDetail = {
    adcode: string
    city: string
    city_code: string
    district: string
    province: string
    street: string
    street_number: string
}

const option: OptionType[] = [
    { label: '是', value: 0 },
    { label: '否', value: 1 }
]

const healthOption: OptionType[] = [
    { label: '正常', value: 1 },
    { label: '异常', value: 0 }
]

function ClockInAddAndUpdate(props: any, ref: any): JSX.Element{
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [initCity, setInitCity] = useState<string>("")
    const [cId, setCId] = useState<string>("")
    const clockRef = useRef<ProFormInstance<FormParams>>();
    useImperativeHandle(ref, (): RefInit => ({
        setIsModalVisible: (Visible: boolean, initClockIn?: ClockInType) => {
            setIsModalVisible(Visible)
            if (initClockIn) {
                clockRef.current?.setFieldsValue(initClockIn)
                setCId(initClockIn.cid as string)
                return
            }
            setCId("")
            clockRef.current?.resetFields()
        },
    }))
    useEffect(() => {
        (async () => {
            const {content}: {content: AddressType} = await instance.get(UrlDict.getAddress)
            setInitCity(content.address)
        })()
    }, [])
    const handleFinish = async (e: FormParams) => {
        let url = ''
        let { uid, uname } = store.getState()?.userInfo;
        e.uid = uid
        e.uname = uname
        e.temperature = parseFloat(e.temperature).toFixed(1)
        if (e.clockInTime instanceof Date) {
            e.clockInTime = SweetUtils.getLocalTime(e.clockInTime as Date, 'YYYY-mm-dd')
        }
        if (cId.length > 0) {
            e.cid = cId
            url = UrlDict.saveOrUpdateClockInById + 'update'
        } else {
            url = UrlDict.saveOrUpdateClockInById + 'save'
        }
        const {code}: R<any> = await instance.post(url, e)
        if (code === 200) {
            message.success(`${cId.length>0?'修改成功!':'打卡成功!'}`, 2)
            setIsModalVisible(false)
            clockRef.current?.resetFields()
        }
        props.refresh()
    }

    return (
        <div>
            <Modal
                width={700}
                style={{padding: '30px'}}
                title={cId.length>0?'修改打卡记录':'个人健康打卡'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[]}>
                <ProForm
                    wrapperCol={{span: 30}}
                    submitter={{render: ()=> (
                            <Button type="primary" size={'large'} htmlType="submit" block>{cId.length>0?'确认修改':'确认打卡'}</Button>
                        )}}
                    onFinish={handleFinish}
                    formRef={clockRef}>
                    <ProForm.Group>
                        <ProFormText
                            width={'md'}
                            name={'name'}
                            placeholder={((store.getState()?.userInfo) as User).uname}
                            disabled={true}
                            label="姓名"
                        />
                        <ProFormDatePicker
                            name={'clockInTime'}
                            disabled
                            initialValue={new Date()}
                            label='打卡时间'/>
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect
                            width={'md'}
                            initialValue={'37.0'}
                            options={SweetUtils.temperature(36.5, 38)}
                            name="temperature"
                            label="体温"
                        />
                        <ProFormRadio.Group
                            name={'health'}
                            initialValue={1}
                            options={healthOption}
                            label={'健康状况'} />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width={'md'}
                            name={'location'}
                            placeholder={'江西省-南昌市'}
                            initialValue={initCity}
                            disabled={true}
                            label="打卡地点"
                        />
                        <ProFormRadio.Group
                            name={'riskAreas'}
                            initialValue={1}
                            options={option}
                            label={'是否去过高，中风险地区'} />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormTextArea
                            width={'md'}
                            fieldProps={{
                                autoSize: true
                            }}
                            initialValue={''}
                            name={'remarks'}
                            label={'备注'}
                            placeholder={'有个别特殊情况请备注'} />
                        <ProFormRadio.Group
                            name={'suspected'}
                            initialValue={1}
                            options={option}
                            label={'是否接触过疑似或确诊'} />
                    </ProForm.Group>
                </ProForm>
            </Modal>
        </div>
    )
}

export default forwardRef(ClockInAddAndUpdate)
