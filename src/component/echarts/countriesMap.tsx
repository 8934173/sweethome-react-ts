import React from "react";
import './countries.less'
import * as echarts from 'echarts'
import {ECBasicOption} from "echarts/types/dist/shared";
import {EChartsType} from "echarts/types/dist/echarts";
import instance from "src/request/index";
import UrlDict from 'src/request/urlDict'
import {AxiosResponse} from "axios";
import {Card, Col, Row, Statistic, Table, Tag} from 'antd'

interface IState {
    nameMap: {}
    map: EChartsType,
    countryTotal: Total,
    countryList: Array<object>,
    time: string
}

interface Total {
    certain?: string
    certain_inc?: string
    die?: string
    die_inc?: string
    ecertain?: string
    ecertain_inc?:string
    recure?: string
    recure_inc?: string
    uncertain?: string
    uncertain_inc?: string
}

export default class CountriesMap extends React.Component<any, IState> {
    state = {
        nameMap: {},
        map: null!,
        countryTotal: {
            certain: '',
            certain_inc: '',
            die: '',
            die_inc: '',
            ecertain: '',
            ecertain_inc: '',
            recure: '',
            recure_inc: '',
            uncertain: '',
            uncertain_inc: ''
        },
        countryList: [],
        time: '0000-00-00 00:00:00'
    }

    columns: Array<object> = [
        {
            title: '城市',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: '累计确诊',
            align: 'center',
            children: [
                {
                    title: '确诊',
                    align: 'center',
                    dataIndex: 'value',
                    render: (data: Readonly<any>) => (<Tag color="warning">{data}</Tag>)
                },
                {
                    title: '新增',
                    align: 'center',
                    dataIndex: 'conadd',
                    render: (data: Readonly<number>) =>{
                        if (!data) return '待公布'
                        return (data && (data > 0)) ? <Tag color='error'>较昨日 + {data}</Tag> : ' 0 新增'
                    }
                }
            ]
        },
        {
            title: '治愈',
            align: 'center',
            dataIndex: 'cureNum',
        },
        {
            title: '死亡',
            align: 'center',
            children: [
                {
                    title: '死亡人数',
                    align: 'center',
                    dataIndex: 'deathNum',
                },
                {
                    title: '死亡新增',
                    align: 'center',
                    dataIndex: 'deathadd',
                    render: (data: Readonly<number>) => {
                        if (!data) return '待公布'
                        return (data && (data > 0)) ? <Tag color='error'>较昨日 + {data}</Tag> : ' 0 新增'
                    }
                }
            ]
        },
        {
            title: '现存确诊',
            dataIndex: 'econNum'
        }
    ]

    getOption = (): ECBasicOption => {
        return {
            // 图表主标题
            title: {
                // text: (`全球疫情分布\n累计死亡 : ${total.certain} 较昨日 : ${total.certain_inc} 累计死亡 : ${total.die}
                // \n 现有确诊 : ${total.ecertain} 较昨日 : ${total.ecertain_inc} 累计治愈 : ${total.recure} 较昨日 : ${total.recure_inc} `), // 主标题文本，支持使用 \n 换行
                top: 20, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                left: 'center', // 值: 'left', 'center', 'right' 同上
                textStyle: { // 文本样式
                    fontSize: 20,
                    fontWeight: 500,
                    color: '#303133'
                }
            },
            // 提示框组件
            tooltip: {
                trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                // 使用函数模板  传入的数据值 -> value: number | Array
                formatter: (val: Readonly<any>) => (
                    `${val.data?.name || val.name}<br>
                    累计确诊 : ${val.data?.value|0}<br>
                    现存确诊 : ${val.data?.econNum|0}<br>
                    累计死亡 : ${val.data?.deathNum|0}<br>
                    治愈人数 : ${val.data?.cureNum|0}`
                ),
            },
            // 视觉映射组件
            visualMap: {
                type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
                show: true, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
                // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
                // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
                min: 0,
                max: 100000000,
                // pieces: [
                //     {min: 10000000},
                //     {min: 1000000, max: 9999999},
                //     {min: 100000, max: 999999},
                //     {min: 10000, max: 99999},
                //     {min: 1000, max: 9999},
                //     {value: 0}
                // ],
                // 文本样式
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                },
                realtime: false, // 拖拽时，是否实时更新
                calculable: true, // 是否显示拖拽用的手柄
                // 定义 在选中范围中 的视觉元素
                inRange: {
                    //color: ['#9fb5ea', '#e6ac53', '#74e2ca', '#85daef', '#9feaa5', '#5475f5'] // 图元的颜色
                    color: ['#937a77', '#ea9fb5', '#e0263c', '#ee334e', '#9feaa5', '#F53112'] // 图元的颜色
                }
            },
            series: [
                {
                    type: 'map', // 类型
                    // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
                    name: '世界地图',
                    map: 'world', // 地图类型
                    // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                    roam: true,
                    // 图形上的文本标签
                    label: {
                        show: false // 是否显示对应地名
                    },
                    // 地图区域的多边形 图形样式
                    itemStyle: {
                        areaColor: '#7B68EE', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                        borderWidth: 0, // 描边线宽 为 0 时无描边
                        borderColor: '#000', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                        borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                    },
                    // 高亮状态下的多边形和标签样式
                    emphasis: {
                        label: {
                            show: true, // 是否显示标签
                            color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                        },
                        itemStyle: {
                            areaColor: '#FF6347' // 地图区域的颜色
                        }
                    },
                    // 自定义地区的名称映射
                    nameMap: this.state.nameMap,
                    // 地图系列中的数据内容数组 数组项可以为单个数值
                    data: this.state.countryList
                }
            ]
        }
    }
    getWoldJson() {
        import('src/assets/country.json').then(af => {
            console.log(af)
            echarts.registerMap('world', JSON.stringify(af))
            import('src/assets/world.json').then((res) => {
                let e = echarts.init(document.getElementById('country') as HTMLElement)
                this.setState((): {nameMap: object, map: EChartsType} => ({
                    nameMap: res.namemap,
                    map: e
                }))
            })
        })
    }
    componentDidMount() {
        (async () => {
            this.getWoldJson()
            await this.getData()
        })()
    }
    async getData() {
        const {data}: AxiosResponse = await instance.get(UrlDict.epidemic)
        this.setState((): {countryTotal: Total, countryList: Array<object>, time: string} => ({
            countryTotal: data.othertotal||{},
            countryList: (data.worldlist||[]).map((it: any, index: number) => {
                it.key = index
                return it
            }),
            time: data.cachetime
        }))
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error, errorInfo)
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        const map: EChartsType = this.state.map
        if (this.state.countryList.length > 0) {
            map.setOption(this.getOption())
        }
    }

    render() {
        return (
            <div className='country'>
                <Card className='card' title={`全球疫情 截止至${this.state.time} 数据统计`}>
                    <Row gutter={20}>
                        <Col span={6} className='row-col'>
                            <Statistic title='累计确诊' value={this.state.countryTotal.certain}/>
                            <div className='add'>较上日 {this.state.countryTotal.certain_inc}</div>
                        </Col>
                        <Col span={6} className='row-col'>
                            <Statistic title='累计死亡' value={this.state.countryTotal.die}/>
                            <div className='add'>较上日 {this.state.countryTotal.die_inc}</div>
                        </Col>
                        <Col span={6} className='row-col'>
                            <Statistic title='现有确诊' value={this.state.countryTotal.ecertain}/>
                            <div className='add'>较上日 {this.state.countryTotal.ecertain_inc}</div>
                        </Col>
                        <Col span={6} className='row-col'>
                            <Statistic title='累计治愈' value={this.state.countryTotal.recure}/>
                            <div className='add'>较上日 {this.state.countryTotal.recure_inc}</div>
                        </Col>
                    </Row>
                </Card>
                <div id='country' className='map' />
                <Table
                    columns={this.columns}
                    size='middle' dataSource={this.state.countryList}
                    pagination={{ pageSize: 50 }}
                    style={{width: '80%', margin: '0 auto'}}
                    scroll={{ y: 540 }}/>
            </div>
        )
    }
}

