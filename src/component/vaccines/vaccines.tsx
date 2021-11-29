import React from "react";
import instance from "src/request";
import UrlDict from "src/request/urlDict";
import {AxiosResponse} from "axios";
import {Col, Divider, Row, Statistic, Table} from 'antd'
import './vaccines.less'
import { ColumnsType } from 'antd/es/table';

interface VaccineSituation {
    country: string
    date: string
    total_vaccinations: number
    total_vaccinations_per_hundred: number
    vaccinations: string
}

interface VaccineTop {
    new_vaccinations: number
    total_vaccinations: number
    total_vaccinations_per_hundred: number
}

interface VaccinesCountry{
    country: string
    date: string
    total_vaccinations: number | bigint
    total_vaccinations_per_hundred: number
    vaccinations: string
}

interface IState {
    VaccineTopData: object,
    VaccineSituationData: Array<VaccineSituation>,
    VaccineBrand: string[]
}

export default class Vaccines extends React.Component<any, IState> {

    state = {
        VaccineTopData: {},
        VaccineSituationData: [],
        VaccineBrand: ['国药/北京', '国药/武汉', '科兴生物', '康希诺']
    }

    columns: ColumnsType<VaccinesCountry> = []

    componentDidMount() {
        (async () => {
            await this.getVaccines()
        })()
    }

    parseNum(num: number = 0) {
        if (num >= 100000000) {
            const a = Math.floor((num / 100000000) * 100) / 100
            return a + '亿'
        } else if (num >= 10000) {
            const a = Math.floor((num / 10000) * 100) / 100
            return a + '万'
        }
        return num
    }

    async getVaccines() {
        const {data}: AxiosResponse = await instance.get(UrlDict.vaccines + 'VaccineSituationData,VaccineTopData')
        this.setState((): { VaccineTopData: any, VaccineSituationData: Array<VaccineSituation> } => ({
            VaccineTopData: data.VaccineTopData,
            VaccineSituationData: data.VaccineSituationData
        }))
        console.log(data)
    }

    VaccinesTopElement() {
        return Object.keys(this.state.VaccineTopData).map((name: any, index: number) => {
            // @ts-ignore
            const names: VaccineTop = this.state.VaccineTopData[name]
            return (
                <React.Fragment key={index}>
                    <Row gutter={20} className='row'>
                        <Col span={8}>
                            <Statistic title={name + '累计接种'} value={this.parseNum(names.total_vaccinations) + '剂'}/>
                        </Col>
                        <Col span={8}>
                            <Statistic title={name + '较上日新增'} value={this.parseNum(names.new_vaccinations) + '剂'}/>
                        </Col>
                        <Col span={8}>
                            <Statistic title={name + '每百人接种'}
                                       value={this.parseNum(names.total_vaccinations_per_hundred) + '剂'}/>
                        </Col>
                    </Row>
                </React.Fragment>
            )
        })
    }

    render() {
        return (
            <div className='vaccines'>
                <div className='row-wrapper'>
                    {this.VaccinesTopElement()}
                    <Divider orientation="left" plain className='orientation'>
                        <h2>全球各国(地区)新冠肺炎疫苗接种情况</h2>
                    </Divider>
                    <Table<VaccinesCountry>
                        size='middle' dataSource={this.state.VaccineSituationData}
                        pagination={false}
                        rowKey={'total_vaccinations'}>
                        <Table.Column<VaccinesCountry> align={'center'} key="country" title="国家(地区)"
                                                       dataIndex="country"/>
                        <Table.Column<VaccinesCountry>
                            align={'center'}
                            key="total_vaccinations" title="累计接种"
                            dataIndex="total_vaccinations"
                            render={(data: number): number => (this.parseNum(data) as number)}
                        />
                        <Table.Column<VaccinesCountry> align={'center'} key="total_vaccinations_per_hundred" title="每百人"
                                                       dataIndex="total_vaccinations_per_hundred"/>
                        <Table.Column<VaccinesCountry>
                            align={'center'}
                            key="vaccinations"
                            title="疫苗研制单位"
                            dataIndex="vaccinations"
                            render={(val: string) => {
                                return val.split(',').map((it: string, index: number): JSX.Element => {
                                    if (this.state.VaccineBrand.includes(it)) {
                                        return (
                                            <React.Fragment key={index}>
                                                <span  style={{color: 'red', whiteSpace: 'nowrap'}}>
                                                    {it}
                                                </span>
                                            </React.Fragment>)
                                    }
                                    return (<React.Fragment key={index}><>{it}</></React.Fragment>)
                                })
                            }}
                        />
                        <Table.Column<VaccinesCountry> align={'center'} key="date" title="更新时间" dataIndex="date"/>
                    </Table>
                </div>
            </div>
        )
    }
}
