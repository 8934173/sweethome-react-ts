import React from "react";
import * as echarts from 'echarts/core'
import {
    GridComponent,
    GridComponentOption,
    LegendComponent,
    LegendComponentOption
} from 'echarts/components';

import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {EChartsType} from "echarts/types/dist/echarts";
echarts.use([GridComponent, LegendComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
    GridComponentOption | LegendComponentOption | BarSeriesOption
    >;

interface IProps {
    list: Array<object>
}

interface IState {
    charts: EChartsType
}

export default class TopEcharts extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            charts: null!
        }
    }
    getOption(): EChartsOption {
        return {
            xAxis: {
                max: 'dataMax'
            },
            yAxis: {
                type: 'category',
                data: this.props?.list.map((it:any) => it.name),
                inverse: true,
                animationDuration: 300,
                animationDurationUpdate: 300,
                max: 9 // only the largest 3 bars will be displayed
            },
            series: [
                {
                    realtimeSort: false,
                    name: '境外输入确诊市TOP10',
                    type: 'bar',
                    data: this.props.list.map((it: any) => it.jwsrNum),
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true
                    }
                }
            ],
            legend: {
                show: true
            },
            animationDuration: 0,
            animationDurationUpdate: 3000,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear'
        }

    }
    componentDidMount() {
        let chart =  echarts.init(document.getElementById('top')!)
        this.setState((): {charts: any} => {
            return ({
                charts: chart
            });
        })
    }
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.props.list.length > 0) {
            const chart = this.state.charts
            chart.setOption<EChartsOption>(this.getOption())
        }
    }

    render() {
        return (
            <div id='top' style={{width: '800px', height: '500px', margin: '0 auto'}} />
        )
    }
}
