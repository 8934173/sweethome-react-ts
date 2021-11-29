import React from "react";
import instance from "src/request";
import * as echarts from 'echarts'
import {ECBasicOption} from "echarts/types/dist/shared";
import {AxiosResponse} from "axios";
import Epidemic from "src/utils/epidemic";
import {EChartsType} from "echarts/types/dist/echarts";
import {Card, Statistic, Row, Col, Table, Tag} from 'antd'
import UrlDict from "../../request/urlDict";
import './chinaMap.less'
import TopEcharts from "./topEcharts";

interface IState {
    epiData: object,
    charts: null | EChartsType,
    list: Array<object>,
    UpdateTime: string
    chinaMapList: Array<object>
    chinaAdd: any,
    chinaTotal: any,
    importedCase: []
}

export default class ChinaMap extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            epiData: {},
            charts: null,
            list: [],
            UpdateTime: '0000-00-00 00:00:00',
            chinaMapList: [],
            chinaAdd: {},
            chinaTotal: {},
            importedCase: []
        }
    }
    columns: Array<object> = [
        {
            title: '城市',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '累计确诊',
            align: 'center',
            dataIndex: 'total',
            render: (data: Readonly<any>) => (<Tag color="warning">{data.confirm}</Tag>)
        },
        {
            title: '现存确诊',
            align: 'center',
            dataIndex: 'total',
            render: (data: Readonly<any>) => data.nowConfirm
        },
        {
            title: '可疑感染人员',
            align: 'center',
            dataIndex: 'total',
            render: (data: Readonly<any>) => data.suspect
        },
        {
            title: '累计死亡',
            align: 'center',
            dataIndex: 'total',
            render: (data: Readonly<any>) => data.dead
        },
        {
            title: '死亡率',
            align: 'center',
            dataIndex: 'total',
            render: (data: Readonly<any>) => (<Tag color="magenta">{data.deadRate+'%'}</Tag>)
        },
        {
            title: '治愈',
            align: 'center',
            dataIndex: 'total',
            render: (data: Readonly<any>) => data.heal
        },
        {
            title: '治愈率',
            align: 'center',
            dataIndex: 'total',
            render: (data: Readonly<any>) => (<Tag color="green">{data.healRate+'%'}</Tag>)
        },
        {
            title: '今日新增',
            align: 'center',
            dataIndex: 'today',
            render: (data: Readonly<any>) => data.confirm
        }
    ]
    getOption = (): ECBasicOption => {
        return (
            {
                title: {
                    //text: "全国疫情地图",
                    x: "center",
                    textStyle: {
                        color: '#9c0505'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    // 新浪数据格式
                    // formatter: (data: Readonly<any>) => {
                    //     return `${data.name}<br>
                    // 累计确诊: ${data.data?.value | 0}<br>
                    // 治愈人数: ${data.data?.cureNum | 0}<br>
                    // 现存: ${data.data?.econNum | 0}<br>
                    // 死亡: ${data.data?.deathNum | 0}`
                    // }
                    formatter: (data: Readonly<any>) => {
                        if (!data.data) return data.name
                        const {confirm, heal, dead, nowConfirm} = data.data.total
                        return `${data.name}<br>
                                累计确诊 : ${confirm|0}<br>
                                现存确诊 : ${nowConfirm}<br>
                                累计治愈 : ${heal}<br>
                                累计死亡 : ${dead}`
                    }
                },
                series: [
                    {
                        type: 'map',
                        map: 'china',
                        data: this.state.chinaMapList,
                        label: {
                            show: true,
                            color: 'black',
                            fontStyle: 10,
                            align: 'center'
                        },
                        scaleLimit: {min: 1, max: 10},
                        zoom: 0.1,    //当前缩放比例
                        roam: true, //是否支持拖拽
                        itemStyle: {
                            borderColor: 'blue' //区域边框线
                        },
                        emphasis: { //高亮显示
                            label: {
                                color: 'black',
                                fontSize: 10
                            },
                            itemStyle: {
                                areaColor: 'lightyellow'
                            }
                        }
                    }
                ],
                visualMap: {
                    type: 'piecewise',
                    show: true,
                    pieces: [
                        {min: 10000},
                        {min: 1000, max: 9999},
                        {min: 500, max: 999},
                        {min: 100, max: 499},
                        {min: 10, max: 99},
                        {min: 1, max: 9},
                        {value: 0}
                    ],
                    inRange: {
                        color: ['#FFFFFF', '#FDEBCA', '#E25552', '#CA2B2D', '#831A26', '#500312'] //颜色梯度变化
                    }
                }
            }
        )
    }

    componentDidMount() {
        (async () => {
            this.getGeo()
            await this.epidemic()
            const map: EChartsType | null = this.state.charts
            await this.epidemicByTencent()
            map?.setOption(this.getOption())
        })()
    }

    async epidemic() {
        const {data}: AxiosResponse = await instance.get('/third/epidemic')
        const list: Array<object> = Epidemic.completion(data.list || [])
        this.setState((): { epiData: object; importedCase: []; list: Array<object> } => {
            return ({
                epiData: data,
                list: list,
                importedCase: data.jwsrTop
            });
        })
    }
    async epidemicByTencent() {
        const {data}: AxiosResponse = await instance.get(UrlDict.epidemicByTencent)
        let ten = JSON.parse(data)
        const list: Array<object> = Epidemic.completion(JSON.parse(data).areaTree[0].children).map((it: any, index: number) => {
            it.value = it.total.nowConfirm
            it.key = index
            it.children.map((ch: any, i: number) => {
                ch.key = i
                return ch
            })
            return it
        })
        this.setState(() => ({
            chinaMapList: list,
            UpdateTime: ten.lastUpdateTime,
            chinaAdd: ten.chinaAdd,
            chinaTotal: ten.chinaTotal
        }))
    }
    getGeo() {
        import('src/assets/china.json').then(data => {
            echarts.registerMap("china", JSON.stringify(data));
            let chart: EChartsType = echarts.init(document.getElementById('main') as HTMLElement)
            this.setState(() => ({
                charts: chart
            }))
        })
    }

    render() {
        return (
            <div>
                <Card className='card' title={`国内疫情(含港澳台) 截止至${this.state.UpdateTime || "00:00"}`}>
                    <Row gutter={20}>
                        <Col span={4} className='row-col'>
                            <Statistic title='累计确诊' value={this.state.chinaTotal.confirm} className='confirm-statistic' />
                            <div className='confirm-add'>较上日 + {this.state.chinaAdd.confirm}</div>
                        </Col>
                        <Col span={4} className='row-col'>
                            <Statistic title="现存确诊" value={this.state.chinaTotal.nowConfirm} className='now-confirm-statistic' />
                            <div className='now-confirm-add'>较上日 + {this.state.chinaAdd.nowConfirm}</div>
                        </Col>
                        <Col span={4} className='row-col'>
                            <Statistic title="累计死亡" value={this.state.chinaTotal.dead} className='dead-statistic' />
                            <div className='dead-add'>较上日 + {this.state.chinaAdd.dead}</div>
                        </Col>
                        <Col span={4} className='row-col'>
                            <Statistic title="累计治愈" value={this.state.chinaTotal.heal} className='heal-statistic' />
                            <div className='heal-add'>较上日 + {this.state.chinaAdd.heal}</div>
                        </Col>
                        <Col span={4} className='row-col'>
                            <Statistic title='境外输入' value={this.state.chinaTotal.importedCase} className='case-statistic'/>
                            <div className='case-add'>较上日 + {this.state.chinaAdd.importedCase}</div>
                        </Col>
                        <Col span={4} className='row-col'>
                            <Statistic title='本土现有确诊' value={this.state.chinaTotal.localConfirm} className='local-statistic'/>
                            <div className='local-add'>较上日 {(this.state.chinaAdd.localConfirm>0?' + '+this.state.chinaAdd.localConfirm:this.state.chinaAdd.localConfirm)|0}</div>
                        </Col>
                    </Row>
                </Card>
                <div style={{width: '800px', height: '800px', margin: '0 auto'}} id='main'/>
                <TopEcharts list={this.state.importedCase} />
                <Table
                    columns={this.columns}
                    size='middle' dataSource={this.state.chinaMapList}
                    style={{width: '80%', margin: '0 auto'}} />

            </div>
        )
    }
}
