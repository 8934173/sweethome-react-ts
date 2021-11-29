export type Leave = {
    outId?: string,
    uname: string,
    phone: string,
    classId: string,
    parentPhone: string,
    health: string,
    destination: string,
    estimateReturnTime?: string,
    track?: string,
    leaveTime: string,
    teaId?: string,
    teaName?: string,
    stuId?: string,
    remarks?: string
    auditStatus?: number,
    createTime: string,
    status?: string,
    outReason?: string
}

export type Revert = {
    inId?: string,
    uname: string,
    phone: string,
    classId: string,
    health: string,
    departure: string,
    track?: string,
    leaveTime: string,
    estimateReturnTime?: string,
    teaId?: string,
    teaName?: string,
    stuId?: string,
    remarks?: string
    auditStatus?: number,
    createTime: string,
    status?: string
}

export const Status: {
    [k: string]: string
}[] = [
    {
        headerColor: '#F56C6C',
        tagColor: 'red',
        text: '审核未通过'
    },
    {
        headerColor: '#C6E2FF',
        tagColor: '',
        text: '审核中'
    },
    {
        headerColor: '#67C23A',
        tagColor: 'green',
        text: '审核通过'
    }
]

export type ActiveKey = 'in'|'out'

export type LR = Leave | Revert
