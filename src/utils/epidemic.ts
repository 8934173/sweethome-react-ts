
export default class Epidemic {

    private static readonly CITY: string[] = [ '北京', '天津', '重庆']

    private static readonly AUTONOMY: string[] = [ '内蒙古', '西藏']

    private static readonly ADMIN: string[] = [ '香港', '澳门' ];

    /**
     * 省级名称补全
     * @param list
     */
    static completion (list: Array<object>): Array<object> {
        return list.map((it: any)  => {
            if (this.ADMIN.includes(it['name'])) {
                it['name'] += '特别行政区'
            } else if (this.AUTONOMY.includes(it['name'])) {
                it['name'] += '自治区'
            } else if (this.CITY.includes(it['name'])) {
                it['name'] += '市'
            } else if (['宁夏'].includes(it['name'])){
                it['name'] += '回族自治区'
            } else if (['新疆'].includes(it['name'])) {
                it['name'] += '维吾尔自治区'
            } else if (['广西'].includes(it['name'])) {
                it['name'] += '壮族自治区'
            } else if (it['name'] === '上海') {
                it['name'] += '市'
            } else {
                it['name'] += '省'
            }
            return it
        })
    }
}
