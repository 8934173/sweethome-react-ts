interface Temperature {
    label:string,
    value: number | string
}

type DateType = 1 | -1

type dt = Date | string

/**
 * 工具类
 */
export default class SweetUtils {

    private static twoCompletion: Function = (num: number): string => num.toString().padStart(2, '0')

    static _TOMORROW: number = 1

    static _YESTERDAY: number = -1


    /**
     * 日期格式化
     * @param time 日期时间
     * @param format 格式
     * 1 ：YYYY-mm-dd HH:MM:SS
     */
    public static getLocalTime(time: Date, format: string): string {
        const date: Date = time || new Date()
        let ret: RegExpExecArray | null
        const option: any = {
            "Y+": date.getFullYear().toString(),
            "m+": this.twoCompletion(date.getMonth()+1),
            "d+": this.twoCompletion(date.getDate()),
            "H+": this.twoCompletion(date.getHours()),
            "M+": this.twoCompletion(date.getMinutes()),
            "S+": this.twoCompletion(date.getSeconds())
        }

        Object.keys(option).forEach((value: string) => {
            ret = new RegExp("(" + value + ")").exec(format)
            if (ret) {
                format = format.replace(ret[1], (ret[1].length === 1) ? (option[value]) : (option[value].padStart(ret[1].length, "0")))
            }
        })
        return format
    }

    /**
     * 获取当前日期是星期几
     * @param {Date} date 标准时间格式 / 时间戳
     * @returns string
     */
    public static getWeekDay (date: Date): string {
        date = date || new Date()
        const weekArray: string[] = ["日", "一", "二", "三", "四", "五", "六"]
        return `星期${weekArray[date.getDay()]}`
    }

    /**
     * 获取当前日期的后一天
     * @param form
     * @param date
     */
    public static getTomorrowOrYesterday (form: DateType, date?: Date): string {
        let num: number = form === 1 ? (24*60*60*1000) : (-24*60*60*1000)
        date = date || new Date();
        date.setTime(date.getTime()+num)
        return date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();
    }

    /**
     * 判断传过来的时间是否与当前时间相等 只精确到天
     * @param date
     */
    public static isToday(date: dt): boolean {
        let today: string = this.getLocalTime(new Date(), 'YYYY-mm-dd')
        if (date instanceof Date) {
            return today === this.getLocalTime(date, 'YYYY-mm-dd')
        }
        return date === today
    }

    /**
     * 生成 uuid
     */
    public static uuid():string {
        let s: Array<string> = [];
        let hexDigits: string = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        // @ts-ignore
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        return  s.join("").replace(new RegExp(/(-)/g), '');
    }

    /**
     * 普通对象转为 FormData 对象
     * @param obj
     */
    public static formData(obj: any): FormData {
        const form: FormData = new FormData()
        if (obj) {
            Object.keys(obj).forEach((key : string) => {
                form.append(key, obj[key])
            })
        }
        return form
    }

    /**
     * 获取两个温度之间的值 精确到小数点后一位
     * @param start 开始（包含开始与结束）
     * @param end 结束
     */
    public static temperature (start: number, end: number): Temperature[] {
        start = (start * 10) - 1
        end = end * 10
        let arr: number[] = []
        let count: number = 1
        while (count <= (end - start)) {
            arr.push(count)
            count++;
        }
        return arr.map((value: number): Temperature => {
            return {
                label: `${((start + value) / 10).toFixed(1)} ℃`,
                value: ((start + value) / 10).toFixed(1)
            }
        })
    }
}
